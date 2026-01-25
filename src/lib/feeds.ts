import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FeedData, Feed, FeedFrontmatter } from '@/types';
import { markdownToHtml } from './markdown';
import { z } from 'zod';

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

const FeedFrontmatterSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    readingTime: z.number().optional(),
    featured: z.boolean().optional(),
    updated: z.string().optional(),
    transliteratedTitle: z.string().optional(),
});

// 프론트매터 유효성 검증 함수
function validateFeedFrontmatter(data: unknown, slug: string): FeedFrontmatter | null {
    const result = FeedFrontmatterSchema.safeParse(data);

    if (!result.success) {
        console.error(`Invalid frontmatter for ${slug}:`, result.error.format());
        return null;
    }

    return result.data;
}

function calculateReadingTime(content: string): number {
    const cleanContent = content.replace(/!\[.*?\]\(.*?\)/g, '') // Remove image links
        .replace(/\[.*?\]\(.*?\)/g, '$1')  // Keep text of links
        .replace(/[#*`]/g, '');            // Remove basic markdown syntax
    const length = cleanContent.length;
    return Math.ceil(length / 500) || 1; // 500 characters per minute, min 1 min
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

                // Auto-calculate reading time if not present
                if (!frontmatter.readingTime) {
                    frontmatter.readingTime = calculateReadingTime(matterResult.content);
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

        // Auto-calculate reading time if not present
        if (!frontmatter.readingTime) {
            frontmatter.readingTime = calculateReadingTime(matterResult.content);
        }

        // Use remark to convert markdown into HTML string
        const contentHtml = await markdownToHtml(matterResult.content);

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
