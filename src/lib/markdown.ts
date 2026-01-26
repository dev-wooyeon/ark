import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import * as cheerio from 'cheerio';
import { TocItem } from '@/lib/feeds';

export async function markdownToHtml(content: string): Promise<string> {
    const processedContent = await remark()
        .use(remarkGfm)
        .use(remarkBreaks)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(content);

    const htmlString = processedContent.toString();

    // 헤딩에 ID 추가
    return addHeadingIds(htmlString);
}

// HTML 헤딩에 ID를 추가하는 함수
function addHeadingIds(html: string): string {
    const $ = cheerio.load(html);
    const idCounts: Record<string, number> = {};

    $('h1, h2, h3, h4, h5, h6').each((_, element) => {
        const heading = $(element);
        if (!heading.attr('id')) {
            const text = heading.text().trim();
            if (text) {
                let id = generateHeadingId(text);

                // 중복 ID 처리
                if (idCounts[id]) {
                    idCounts[id]++;
                    id = `${id}-${idCounts[id]}`;
                } else {
                    idCounts[id] = 1;
                }

                heading.attr('id', id);
            }
        }
    });

    return $.html();
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
