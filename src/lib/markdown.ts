import * as cheerio from 'cheerio';
import { TocItem } from '@/lib/mdx-feeds';
import fs from 'fs';
import path from 'path';

// 헤딩 텍스트를 ID로 변환하는 함수
function generateHeadingId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // 특수문자 제거
        .replace(/\s+/g, '-') // 공백을 하이픈으로
        .replace(/-+/g, '-') // 연속된 하이픈 하나로
        .trim();
}


// MDX 소스에서 헤딩 파싱 (렌더링된 HTML이 아닌 원본 MDX에서)
export function parseHeadingsFromMdx(mdxContent: string): TocItem[] {
    try {
        if (!mdxContent || typeof mdxContent !== 'string') {
            console.warn('Invalid MDX content for TOC parsing');
            return [];
        }

        // Regex to match markdown headings (## Heading, ### Heading, etc.)
        const headingRegex = /^(#{1,6})\s+(.+)$/gm;
        const tocItems: TocItem[] = [];
        const stack: TocItem[] = [];
        const idCounts: Record<string, number> = {};

        let match;
        while ((match = headingRegex.exec(mdxContent)) !== null) {
            const level = match[1].length; // Number of # symbols
            const text = match[2].trim();

            if (!text) continue;

            // Generate unique ID
            let id = generateHeadingId(text);
            if (idCounts[id]) {
                idCounts[id]++;
                id = `${id}-${idCounts[id]}`;
            } else {
                idCounts[id] = 1;
            }

            const tocItem: TocItem = {
                id,
                text,
                level,
                children: [],
            };

            // Build hierarchy using stack
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
        }

        return tocItems;
    } catch (error) {
        console.error('Error parsing MDX for TOC:', error);
        return [];
    }
}

// MDX 소스 파일 로드 (TOC 생성용)
export function getMdxSource(slug: string): string | null {
    try {
        const contentDirectory = path.join(process.cwd(), 'content');
        const filePath = path.join(contentDirectory, slug, 'index.mdx');
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Failed to read MDX source for ${slug}:`, error);
        return null;
    }
}
