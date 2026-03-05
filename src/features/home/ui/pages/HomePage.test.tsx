import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import HomePage from './HomePage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);
const mockGetSeriesSummaries = vi.fn(() => []);
const mockGetPopularViewsInRecentDays = vi.fn(async () => []);

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('@/features/blog/model/series-group', () => ({
  getSeriesSummaries: (...args: unknown[]) => mockGetSeriesSummaries(...args),
}));

vi.mock('@/app/actions/view', () => ({
  getPopularViewsInRecentDays: (...args: unknown[]) =>
    mockGetPopularViewsInRecentDays(...args),
}));

vi.mock('@/shared/layout', () => ({
  Header: () => <div data-testid="mock-header" />,
}));

const mockHeroSection = vi.fn(() => <div data-testid="hero" />);

vi.mock('@/features/home/ui/sections/HeroSection', () => ({
  default: (props: unknown) => mockHeroSection(props),
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
  it('fills popular list with latest non-series posts when view data is empty', async () => {
    mockGetSortedFeedData.mockReturnValue([
      createPost(1),
      createPost(2),
      createPost(3),
      createPost(4),
      createPost(5),
      createPost(6),
    ]);
    mockGetSeriesSummaries.mockReturnValue([]);
    mockGetPopularViewsInRecentDays.mockResolvedValue([]);

    const element = await HomePage();
    render(element);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();

    const firstCallArgs = mockHeroSection.mock.calls[0]?.[0] as {
      popularPosts: Array<{ post: FeedData; viewCount: number | null }>;
    };

    expect(firstCallArgs.popularPosts).toHaveLength(5);
    expect(
      firstCallArgs.popularPosts.every((item) => item.viewCount === null)
    ).toBe(true);
    expect(firstCallArgs.popularPosts[0].post.slug).toBe('post-1');
  });
});
