// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getSortedFeedData } from '@/blog/services/post-repository';
import { SITE_URL } from '@/site/config/site';
import sitemap from './sitemap';

describe('sitemap', () => {
  it('excludes private posts from sitemap entries', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const privatePosts = getSortedFeedData({ includePrivate: true }).filter(
      (post) => post.visibility === 'private'
    );

    expect(urls).toContain(`${SITE_URL}/blog/ctr-pipeline`);
    expect(privatePosts.length).toBeGreaterThan(0);
    for (const post of privatePosts) {
      expect(urls, `${post.slug} leaked to sitemap`).not.toContain(
        `${SITE_URL}/blog/${post.slug}`
      );
    }
  });
});
