// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { GET } from './route';

describe('/feed.xml', () => {
  it('excludes private posts from the generated RSS feed', async () => {
    const response = await GET();
    const xml = await response.text();
    const privatePosts = getSortedFeedData({ includePrivate: true }).filter(
      (post) => post.visibility === 'private'
    );

    expect(xml).toContain('ctr-pipeline');
    expect(privatePosts.length).toBeGreaterThan(0);
    for (const post of privatePosts) {
      expect(xml, `${post.slug} leaked to RSS`).not.toContain(post.slug);
    }
  });
});
