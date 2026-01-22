import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FeedData, Feed, FeedFrontmatter } from '@/types';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import * as cheerio from 'cheerio';

const feedsDirectory = path.join(process.cwd(), 'feeds');

// 안전한 파일 시스템 작업을 위한 유틸리티 함수들
function safeReadFile(filePath: string): string | null {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error);
        return null;
    }
}

function safeReaddir(dirPath: string): string[] | null {
    try {
        return fs.readdirSync(dirPath);
    } catch (error) {
        console.error(`Failed to read directory: ${dirPath}`, error);
        return null;
    }
}

function safeExists(path: string): boolean {
    try {
        return fs.existsSync(path);
    } catch (error) {
        console.error(`Failed to check existence: ${path}`, error);
        return false;
    }
}

// 프론트매터 유효성 검증 함수
function validateFeedFrontmatter(data: any, slug: string): FeedFrontmatter | null {
    if (!data || typeof data !== 'object') {
        console.error(`Invalid frontmatter for ${slug}: not an object`);
        return null;
    }

    const { title, description, date, category } = data;

    if (!title || typeof title !== 'string') {
        console.error(`Invalid title for ${slug}: ${title}`);
        return null;
    }

    if (!description || typeof description !== 'string') {
        console.error(`Invalid description for ${slug}: ${description}`);
        return null;
    }

    if (!date || typeof date !== 'string') {
        console.error(`Invalid date for ${slug}: ${date}`);
        return null;
    }

    if (!category || typeof category !== 'string') {
        console.error(`Invalid category for ${slug}: ${category}`);
        return null;
    }

    return {
        title,
        description,
        date,
        category,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        image: typeof data.image === 'string' ? data.image : undefined,
        readingTime: typeof data.readingTime === 'number' ? data.readingTime : undefined,
        featured: typeof data.featured === 'boolean' ? data.featured : undefined,
        updated: typeof data.updated === 'string' ? data.updated : undefined,
    };
}

export function getSortedFeedData(): FeedData[] {
    // Get file names under /feeds
    if (!safeExists(feedsDirectory)) {
        console.warn('Feeds directory does not exist');
        return [];
    }

    const fileNames = safeReaddir(feedsDirectory);
    if (!fileNames) {
        console.error('Failed to read feeds directory');
        return [];
    }

    const allFeedData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get id
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(feedsDirectory, fileName);
            const fileContents = safeReadFile(fullPath);

            if (!fileContents) {
                console.error(`Failed to read feed file: ${fileName}`);
                return null;
            }

            try {
                // Use gray-matter to parse the feed metadata section
                const matterResult = matter(fileContents);

                // Validate frontmatter
                const frontmatter = validateFeedFrontmatter(matterResult.data, slug);
                if (!frontmatter) {
                    console.error(`Invalid frontmatter for ${slug}, skipping`);
                    return null;
                }

                // Combine the data with the id
                return {
                    slug,
                    ...frontmatter,
                };
            } catch (error) {
                console.error(`Failed to parse frontmatter for ${slug}:`, error);
                return null;
            }
        })
        .filter((feed): feed is FeedData => feed !== null);

    // Sort feed by date
    return allFeedData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllFeedSlugs() {
    if (!safeExists(feedsDirectory)) {
        console.warn('Feeds directory does not exist');
        return [];
    }

    const fileNames = safeReaddir(feedsDirectory);
    if (!fileNames) {
        console.error('Failed to read feeds directory');
        return [];
    }

    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => ({
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        }));
}

export async function getFeedData(slug: string): Promise<Feed | null> {
    const fullPath = path.join(feedsDirectory, `${slug}.md`);
    const fileContents = safeReadFile(fullPath);

    if (!fileContents) {
        console.error(`Feed file not found: ${slug}`);
        return null;
    }

    try {
        // Use gray-matter to parse the feed metadata section
        const matterResult = matter(fileContents);

        // Validate frontmatter
        const frontmatter = validateFeedFrontmatter(matterResult.data, slug);
        if (!frontmatter) {
            console.error(`Invalid frontmatter for ${slug}`);
            return null;
        }

        // Use remark to convert markdown into HTML string
        const processedContent = await remark()
            .use(remarkGfm)
            .use(remarkBreaks)
            .use(remarkRehype)
            .use(rehypeHighlight)
            .use(rehypeStringify)
            .process(matterResult.content);

        const contentHtml = processedContent.toString();

        // Combine the data with the slug and contentHtml
        return {
            slug,
            contentHtml,
            ...frontmatter,
        };
    } catch (error) {
        console.error(`Failed to process feed data for ${slug}:`, error);
        return null;
    }
}

// 목차 아이템 타입
export interface TocItem {
    id: string;
    text: string;
    level: number;
    children?: TocItem[];
}

// HTML에서 헤딩들을 파싱해서 목차 데이터 생성
export function parseHeadingsFromHtml(htmlContent: string): TocItem[] {
    try {
        if (!htmlContent || typeof htmlContent !== 'string') {
            console.warn('Invalid HTML content for TOC parsing');
            return [];
        }

        const $ = cheerio.load(htmlContent);
        const headings = $('h1, h2, h3, h4, h5, h6');

        const tocItems: TocItem[] = [];
        const stack: TocItem[] = [];

        headings.each((_, element) => {
            try {
                const heading = $(element);
                const level = parseInt(element.name.charAt(1));

                if (isNaN(level) || level < 1 || level > 6) {
                    console.warn(`Invalid heading level: ${element.name}`);
                    return;
                }

                const text = heading.text().trim();
                if (!text) {
                    return; // 빈 헤딩은 무시
                }

                const id = heading.attr('id') || generateHeadingId(text);

                const tocItem: TocItem = {
                    id,
                    text,
                    level,
                    children: []
                };

                // 스택을 이용해 계층 구조 생성
                while (stack.length > 0 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                if (stack.length === 0) {
                    tocItems.push(tocItem);
                } else {
                    const parent = stack[stack.length - 1];
                    parent.children = parent.children || [];
                    parent.children.push(tocItem);
                }

                stack.push(tocItem);
            } catch (error) {
                console.error(`Error processing heading element:`, error);
            }
        });

        return tocItems;
    } catch (error) {
        console.error('Error parsing HTML for TOC:', error);
        return [];
    }
}

// 헤딩 텍스트를 ID로 변환하는 함수
function generateHeadingId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 특수문자 제거
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .replace(/-+/g, '-') // 연속된 하이픈 하나로
        .trim();
}
