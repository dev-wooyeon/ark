import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import HomePage from './HomePage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);

vi.mock('@/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
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
  it('passes the latest-first posts to the home client', () => {
    mockGetSortedFeedData.mockReturnValue([
      createPost(1),
      createPost(2),
      createPost(3),
      createPost(4),
      createPost(5),
      createPost(6),
    ]);
    render(<HomePage />);

    expect(screen.getByTestId('home-page-client')).toBeInTheDocument();

    const firstCallArgs = mockHomePageClient.mock.calls[0]?.[0] as {
      posts: FeedData[];
    };

    expect(firstCallArgs.posts).toHaveLength(6);
    expect(firstCallArgs).not.toHaveProperty('popularViews');
  });
});
