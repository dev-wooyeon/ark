import { describe, expect, it } from 'vitest';
import { getSearchActions } from './search';

describe('getSearchActions', () => {
  it('returns searchable actions from posts', () => {
    const actions = getSearchActions([
      {
        slug: 'redis-basics',
        title: 'Redis Basics',
        category: 'Series',
        tags: ['Redis', 'Caching'],
        description: 'Redis 기초 개념 정리',
      },
    ]);

    expect(actions).toHaveLength(1);
    expect(actions[0].id).toBe('redis-basics');
    expect(actions[0].name).toBe('Redis Basics');
    expect(actions[0].section).toBe('블로그 포스트');
    expect(actions[0].keywords).toContain('Redis');
  });
});
