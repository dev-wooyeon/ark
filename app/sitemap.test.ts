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

  it('includes public hub routes for discovery', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        SITE_URL,
        `${SITE_URL}/blog`,
        `${SITE_URL}/engineering`,
        `${SITE_URL}/life`,
        `${SITE_URL}/series`,
        `${SITE_URL}/resume`,
        `${SITE_URL}/rss.xml`,
      ])
    );
  });

  it('uses updated date for post lastModified when available', () => {
    const entries = sitemap();
    const publicUpdatedPost = getSortedFeedData().find((post) => post.updated);

    if (!publicUpdatedPost) {
      return;
    }

    expect(
      entries.find(
        (entry) => entry.url === `${SITE_URL}/blog/${publicUpdatedPost.slug}`
      )?.lastModified
    ).toBe(publicUpdatedPost.updated);
  });
});
