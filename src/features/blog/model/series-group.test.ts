import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import { getSeriesGroups, getSeriesSummaries } from './series-group';

const posts: FeedData[] = [
  {
    slug: 'redis-2',
    title: 'Redis 2',
    description: 'Redis 심화',
    date: '2026-02-03',
    category: 'Series',
    readingTime: 12,
    series: { id: 'redis', title: 'Redis Deep Dive', order: 2 },
  },
  {
    slug: 'go-1',
    title: 'Go 1',
    description: 'Go 시작',
    date: '2026-02-05',
    category: 'Series',
    readingTime: 9,
    series: { id: 'go', title: 'Go Mastery', order: 1 },
  },
  {
    slug: 'redis-1',
    title: 'Redis 1',
    description: 'Redis 기초',
    date: '2026-02-01',
    category: 'Series',
    readingTime: 10,
    series: { id: 'redis', title: 'Redis Deep Dive', order: 1 },
  },
  {
    slug: 'go-2',
    title: 'Go 2',
    description: 'Go 패턴',
    date: '2026-02-06',
    category: 'Series',
    series: { id: 'go', title: 'Go Mastery', order: 2 },
  },
  {
    slug: 'tech-note',
    title: 'Tech Note',
    description: '일반 글',
    date: '2026-02-07',
    category: 'Tech',
  },
];

describe('series-group', () => {
  it('returns summaries sorted by latest update date', () => {
    const summaries = getSeriesSummaries(posts);

    expect(summaries).toHaveLength(2);
    expect(summaries[0].id).toBe('go');
    expect(summaries[0].latestDate).toBe('2026-02-06');
    expect(summaries[1].id).toBe('redis');
    expect(summaries[1].latestDate).toBe('2026-02-03');
  });

  it('sorts episodes by order and calculates aggregate fields', () => {
    const summaries = getSeriesSummaries(posts);
    const redisSummary = summaries.find((summary) => summary.id === 'redis');

    expect(redisSummary).toBeDefined();
    if (!redisSummary) {
      return;
    }

    expect(redisSummary.posts.map((post) => post.slug)).toEqual([
      'redis-1',
      'redis-2',
    ]);
    expect(redisSummary.firstPostSlug).toBe('redis-1');
    expect(redisSummary.postCount).toBe(2);
    expect(redisSummary.totalReadingMinutes).toBe(22);
  });

  it('keeps getSeriesGroups backward compatible', () => {
    const groups = getSeriesGroups(posts);
    const redisGroup = groups.find((group) => group.id === 'redis');

    expect(redisGroup).toBeDefined();
    if (!redisGroup) {
      return;
    }

    expect(redisGroup.title).toBe('Redis Deep Dive');
    expect(redisGroup.posts).toHaveLength(2);
    expect(redisGroup.latestDate).toBe('2026-02-03');
  });
});
