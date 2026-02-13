import { describe, expect, it } from 'vitest';
import { getSeriesPosts, getSortedFeedData } from './mdx-feeds';

describe('mdx-feeds utilities', () => {
  it('returns posts sorted by date in descending order', () => {
    const posts = getSortedFeedData();

    expect(posts.length).toBeGreaterThan(0);
    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });

  it('returns series posts sorted by order', () => {
    const redisPosts = getSeriesPosts('redis-deep-dive');

    expect(redisPosts.length).toBeGreaterThan(0);
    const orders = redisPosts.map((post) => post.series?.order ?? 0);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});
