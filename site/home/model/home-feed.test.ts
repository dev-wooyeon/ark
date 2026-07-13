import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import { buildHomeCategoryCounts, filterHomePosts } from './home-feed';

function createPost(
  slug: string,
  category: FeedData['category'],
  date: string
): FeedData {
  return {
    slug,
    title: slug,
    description: `${slug} description`,
    date,
    category,
  };
}

describe('home-feed model', () => {
  it('builds category counts for all home filters', () => {
    const posts = [
      createPost('one', 'Tech', '2026-04-01'),
      createPost('two', 'Life', '2026-04-02'),
      createPost('three', 'Tech', '2026-04-03'),
    ];

    expect(buildHomeCategoryCounts(posts)).toEqual({
      All: 3,
      Tech: 2,
      Life: 1,
    });
  });

  it('filters by category while preserving the latest-first input order', () => {
    const posts = [
      createPost('latest-tech', 'Tech', '2026-04-03'),
      createPost('latest-life', 'Life', '2026-04-02'),
      createPost('older-tech', 'Tech', '2026-04-01'),
    ];

    expect(filterHomePosts(posts, 'Tech').map((post) => post.slug)).toEqual([
      'latest-tech',
      'older-tech',
    ]);
    expect(filterHomePosts(posts, 'All')).toEqual(posts);
  });
});
