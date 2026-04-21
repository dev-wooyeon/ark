import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import {
  buildHomeCategoryCounts,
  filterHomePosts,
  type HomePopularView,
} from './home-feed';

function createPost(
  slug: string,
  category: FeedData['category'],
  date: string,
  overrides: Partial<FeedData> = {}
): FeedData {
  return {
    slug,
    title: slug,
    description: `${slug} description`,
    date,
    category,
    ...overrides,
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

  it('filters posts by query across title, description, tags, and series', () => {
    const posts = [
      createPost('redis', 'Tech', '2026-04-03', {
        title: 'Redis 운영 회고',
        tags: ['Cache'],
      }),
      createPost('travel', 'Life', '2026-04-02', {
        title: '베트남 여행 후기',
      }),
      createPost('flink-series', 'Tech', '2026-04-01', {
        title: '체크포인트 정리',
        series: {
          id: 'flink',
          title: 'Flink 완전정복',
          order: 1,
        },
      }),
    ];

    expect(
      filterHomePosts(posts, [], {
        query: 'cache',
        category: 'All',
        sortOrder: 'latest',
      }).map((post) => post.slug)
    ).toEqual(['redis']);

    expect(
      filterHomePosts(posts, [], {
        query: 'flink',
        category: 'All',
        sortOrder: 'latest',
      }).map((post) => post.slug)
    ).toEqual(['flink-series']);
  });

  it('sorts by popularity first and falls back to latest order', () => {
    const posts = [
      createPost('older-popular', 'Tech', '2026-04-01'),
      createPost('latest-normal', 'Tech', '2026-04-03'),
      createPost('mid-popular', 'Life', '2026-04-02'),
    ];
    const popularViews: HomePopularView[] = [
      { slug: 'mid-popular', count: 10 },
      { slug: 'older-popular', count: 20 },
    ];

    expect(
      filterHomePosts(posts, popularViews, {
        query: '',
        category: 'All',
        sortOrder: 'popular',
      }).map((post) => post.slug)
    ).toEqual(['older-popular', 'mid-popular', 'latest-normal']);
  });
});
