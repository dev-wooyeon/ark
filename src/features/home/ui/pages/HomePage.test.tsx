import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import HomePage from './HomePage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);
const mockGetPopularViewsInRecentDays = vi.fn(async () => []);

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('@/app/actions/view', () => ({
  getPopularViewsInRecentDays: (...args: unknown[]) =>
    mockGetPopularViewsInRecentDays(...args),
}));

const mockHomePageClient = vi.fn(() => <div data-testid="home-page-client" />);

vi.mock('./HomePageClient', () => ({
  default: (props: unknown) => mockHomePageClient(props),
}));

function createPost(index: number): FeedData {
  return {
    slug: `post-${index}`,
    title: `글 ${index}`,
    description: '설명',
    date: `2026-03-${String(index).padStart(2, '0')}`,
    category: index % 2 === 0 ? 'Tech' : 'Life',
  };
}

describe('HomePage', () => {
  it('passes posts and normalized popular views to the home client', async () => {
    mockGetSortedFeedData.mockReturnValue([
      createPost(1),
      createPost(2),
      createPost(3),
      createPost(4),
      createPost(5),
      createPost(6),
    ]);
    mockGetPopularViewsInRecentDays.mockResolvedValue([
      {
        slug: 'post-2',
        count: 17,
        updated_at: '2026-03-20T00:00:00.000Z',
      },
    ]);

    const element = await HomePage();
    render(element);

    expect(screen.getByTestId('home-page-client')).toBeInTheDocument();
    expect(mockGetPopularViewsInRecentDays).toHaveBeenCalledWith(30, 6);

    const firstCallArgs = mockHomePageClient.mock.calls[0]?.[0] as {
      posts: FeedData[];
      popularViews: Array<{ slug: string; count: number }>;
    };

    expect(firstCallArgs.posts).toHaveLength(6);
    expect(firstCallArgs.popularViews).toEqual([
      { slug: 'post-2', count: 17 },
    ]);
  });
});
