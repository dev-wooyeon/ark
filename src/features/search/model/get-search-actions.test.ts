import { describe, expect, it, vi } from 'vitest';
import { getSearchActions } from './get-search-actions';

const mockTrackEvent = vi.fn();

vi.mock('@/shared/analytics/lib/analytics', () => ({
  AnalyticsEvents: {
    click: 'click',
    theme: 'theme',
    view: 'view',
  },
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

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

  it('handles missing tag arrays without crashing', () => {
    const actions = getSearchActions([
      {
        slug: 'no-tags',
        title: 'No Tags',
        category: 'Life',
        description: 'Tags missing post',
        tags: undefined,
      },
    ]);

    expect(actions).toHaveLength(1);
    expect(actions[0].keywords).toBe('No Tags Life Tags missing post');
  });

  it('keeps post list order as provided', () => {
    const actions = getSearchActions([
      { slug: 'second', title: 'B', category: 'Tech', tags: ['A'], description: 'B' },
      { slug: 'first', title: 'A', category: 'Tech', tags: ['A'], description: 'A' },
    ]);

    expect(actions.map((action) => action.id)).toEqual(['second', 'first']);
  });

  it('tracks and navigates when action is performed', () => {
    mockTrackEvent.mockClear();

    const [action] = getSearchActions([
      {
        slug: 'redis-basics',
        title: 'Redis Basics',
        category: 'Series',
        tags: ['Redis'],
        description: 'Redis 기초',
      },
    ]);

    action.perform?.();

    expect(mockTrackEvent).toHaveBeenCalledWith('click', {
      target: 'command_palette_result',
      post_slug: 'redis-basics',
    });
    expect(typeof action.perform).toBe('function');
    expect(() => action.perform?.()).not.toThrow();
  });
});
