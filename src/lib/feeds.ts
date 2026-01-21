import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { FeedData } from '@/types';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import * as cheerio from 'cheerio';

const feedsDirectory = path.join(process.cwd(), 'feeds');

export function getSortedFeedData(): FeedData[] {
    // Get file names under /feeds
    if (!fs.existsSync(feedsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(feedsDirectory);
    const allFeedData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get id
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(feedsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the feed metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the id
            return {
                slug,
                ...(matterResult.data as { date: string; title: string; category: string; description: string; tags?: string[] }),
            };
        });

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
    if (!fs.existsSync(feedsDirectory)) {
        return [];
    }
    const fileNames = fs.readdirSync(feedsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getFeedData(slug: string) {
    const fullPath = path.join(feedsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the feed metadata section
    const matterResult = matter(fileContents);

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
        ...(matterResult.data as { date: string; title: string; category: string; description: string; tags?: string[] }),
    };
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
    const $ = cheerio.load(htmlContent);
    const headings = $('h1, h2, h3, h4, h5, h6');

    const tocItems: TocItem[] = [];
    const stack: TocItem[] = [];

    headings.each((_, element) => {
        const heading = $(element);
        const level = parseInt(element.name.charAt(1));
        const text = heading.text().trim();
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
    });

    return tocItems;
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
