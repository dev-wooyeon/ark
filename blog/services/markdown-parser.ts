import {
  createHeadingIdGenerator,
  normalizeHeadingText,
} from '@/blog/model/heading';
import { getFolderSlug, type TocItem } from '@/blog/services/post-repository';
import fs from 'fs';
import path from 'path';

// MDX 소스에서 헤딩 파싱 (렌더링된 HTML이 아닌 원본 MDX에서)
export function parseHeadingsFromMdx(mdxContent: string): TocItem[] {
  try {
    if (!mdxContent || typeof mdxContent !== 'string') {
      return [];
    }

    const tocItems: TocItem[] = [];
    const nextHeadingId = createHeadingIdGenerator();
    const lines = mdxContent.split(/\r?\n/);
    let activeFence: { marker: '`' | '~'; length: number } | null = null;

    for (const line of lines) {
      const fenceMatch = /^\s*(`{3,}|~{3,})/.exec(line);

      if (fenceMatch) {
        const fenceMarker = fenceMatch[1][0] as '`' | '~';
        const fenceLength = fenceMatch[1].length;

        if (!activeFence) {
          activeFence = {
            marker: fenceMarker,
            length: fenceLength,
          };
        } else if (
          activeFence.marker === fenceMarker &&
          fenceLength >= activeFence.length
        ) {
          activeFence = null;
        }

        continue;
      }

      if (activeFence) {
        continue;
      }

      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);

      if (!headingMatch) {
        continue;
      }

      const level = headingMatch[1].length;
      const text = normalizeHeadingText(headingMatch[2]);
      const id = nextHeadingId(text);

      if (!text || !id) {
        continue;
      }

      tocItems.push({
        id,
        text,
        level,
      });
    }

    return tocItems;
  } catch {
    return [];
  }
}

// MDX 소스 파일 로드 (TOC 생성용)
export function getMdxSource(slug: string): string | null {
  try {
    const folderSlug = getFolderSlug(slug) || slug;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filePath = path.join(postsDirectory, folderSlug, 'index.mdx');
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}
