// @vitest-environment node

import fs from 'fs';
import path from 'path';
import { describe, expect, it, vi } from 'vitest';
import {
  calculateReadingTime,
  getFeedData,
  getFolderSlug,
  getSeriesPosts,
  getSortedFeedData,
  getAllFeedSlugs,
} from './post-repository';

const postsDirectory = path.join(process.cwd(), 'posts');

describe('post repository utilities', () => {
  it('ignores fenced code blocks and hidden details when calculating reading time', () => {
    const proseOnly = '가'.repeat(1400);
    const content = `${proseOnly}

\`\`\`text
${'x'.repeat(5000)}
\`\`\`

<details>
  <summary>hidden</summary>
  ${'y'.repeat(5000)}
</details>`;

    expect(calculateReadingTime(content)).toBe(2);
  });

  it('weights markdown tables lighter than prose when calculating reading time', () => {
    const proseContent = '가'.repeat(1000);
    const tableContent = `| column |
| --- |
| ${'가'.repeat(1000)} |`;

    expect(calculateReadingTime(proseContent)).toBe(2);
    expect(calculateReadingTime(tableContent)).toBe(1);
  });

  it('returns posts sorted by date in descending order', () => {
    const posts = getSortedFeedData();

    expect(posts.length).toBeGreaterThan(0);
    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });

  it('fills image metadata from mdx content when meta image is missing', () => {
    const posts = getSortedFeedData();

    const hasExtractedImage = posts.some(
      (post) => typeof post.image === 'string' && post.image.length > 0
    );

    expect(hasExtractedImage).toBe(true);
  });

  it('returns series posts sorted by order', () => {
    const redisPosts = getSeriesPosts('redis-deep-dive', {
      includePrivate: true,
    });

    expect(redisPosts.length).toBeGreaterThan(0);
    const orders = redisPosts.map((post) => post.series?.order ?? 0);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('returns empty array for unknown series id', () => {
    expect(getSeriesPosts('non-existent-series-id')).toEqual([]);
  });

  it('returns slug list with all feed entries', () => {
    const slugs = getAllFeedSlugs();

    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs.every((item) => item.slug.length > 0)).toBe(true);
  });

  it('filters private posts out of the default listing and static params', () => {
    const publicPosts = getSortedFeedData();
    const allPosts = getSortedFeedData({ includePrivate: true });
    const publicSlugs = new Set(publicPosts.map((post) => post.slug));
    const privatePosts = allPosts.filter(
      (post) => post.visibility === 'private'
    );

    expect(privatePosts.length).toBeGreaterThan(0);

    const publicStaticSlugs = new Set(
      getAllFeedSlugs().map((item) => item.slug)
    );
    for (const post of privatePosts) {
      expect(publicSlugs.has(post.slug), `${post.slug} leaked to listing`).toBe(
        false
      );
      expect(
        publicStaticSlugs.has(post.slug),
        `${post.slug} leaked to static params`
      ).toBe(false);
    }
  });

  it('returns private posts only when includePrivate is true', async () => {
    const privateSlug = 'fixed-ai-dev-environment';

    expect(getFolderSlug(privateSlug)).not.toBeNull();
    expect(await getFeedData(privateSlug)).toBeNull();
  });

  it('filters private series posts from helper lookups', () => {
    expect(getSeriesPosts('redis-deep-dive')).toEqual([]);
    expect(
      getSeriesPosts('redis-deep-dive', { includePrivate: true }).length
    ).toBeGreaterThan(0);
  });

  it('returns null for non-existent posts folder slug', () => {
    expect(getFolderSlug('missing-folder-slug')).toBeNull();
  });

  it('returns null for unknown feed detail path', async () => {
    const feed = await getFeedData('does-not-exist');

    expect(feed).toBeNull();
  });

  it('returns empty feed list when reading posts directory fails', () => {
    const readdirSpy = vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Posts directory unavailable');
    });

    try {
      expect(getAllFeedSlugs()).toEqual([]);
      expect(getSortedFeedData()).toEqual([]);
    } finally {
      readdirSpy.mockRestore();
    }
  });

  it('skips invalid metadata entries and keeps parser failures from breaking list', () => {
    const readdirSpy = vi
      .spyOn(fs, 'readdirSync')
      .mockImplementation((target) => {
        const targetPath = String(target);
        if (targetPath === postsDirectory) {
          return ['broken-folder'];
        }
        if (targetPath === path.join(postsDirectory, 'broken-folder')) {
          return [];
        }
        return [];
      });
    const existsSpy = vi
      .spyOn(fs, 'existsSync')
      .mockImplementation((target) => {
        const targetPath = String(target);
        return (
          targetPath ===
            path.join(postsDirectory, 'broken-folder', 'index.mdx') ||
          targetPath === path.join(postsDirectory, 'broken-folder', 'meta.json')
        );
      });
    const statSpy = vi
      .spyOn(fs, 'statSync')
      .mockImplementation(() => ({ isDirectory: () => true }) as fs.Stats);
    const readFileSpy = vi
      .spyOn(fs, 'readFileSync')
      .mockImplementation((target) => {
        const targetPath = String(target);

        if (
          targetPath === path.join(postsDirectory, 'broken-folder', 'meta.json')
        ) {
          return '{invalid-json';
        }

        return '';
      });

    try {
      expect(getSortedFeedData()).toEqual([]);
    } finally {
      readdirSpy.mockRestore();
      existsSpy.mockRestore();
      statSpy.mockRestore();
      readFileSpy.mockRestore();
    }
  });
});
