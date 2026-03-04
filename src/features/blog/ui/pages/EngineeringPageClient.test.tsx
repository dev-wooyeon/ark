import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import EngineeringPageClient from './EngineeringPageClient';

let mockQueryString = '';
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: () => '/engineering',
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(mockQueryString),
}));

vi.mock('@/features/blog/ui/components', () => ({
  PostList: ({ posts }: { posts: FeedData[] }) => (
    <div data-testid="post-list">{posts.map((post) => post.slug).join(',')}</div>
  ),
  SeriesHubList: ({ seriesSummaries }: { seriesSummaries: Array<{ id: string }> }) => (
    <div data-testid="series-list">
      {seriesSummaries.map((summary) => summary.id).join(',')}
    </div>
  ),
}));

vi.mock('@/shared/ui', () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

const samplePosts: FeedData[] = [
  {
    slug: 'tech-article',
    title: 'Tech Article',
    description: 'article',
    date: '2026-03-01',
    category: 'Tech',
    tags: ['Redis'],
  },
  {
    slug: 'series-ep1',
    title: 'Series Episode',
    description: 'series',
    date: '2026-03-02',
    category: 'Tech',
    tags: ['Flink'],
    series: {
      id: 'flink-mastery',
      title: 'Flink Mastery',
      order: 1,
    },
  },
];

describe('EngineeringPageClient', () => {
  beforeEach(() => {
    mockQueryString = '';
    mockReplace.mockClear();
  });

  it('renders article and series sections by default', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    expect(screen.getByText('최신 아티클')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '시리즈' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('post-list')).toHaveTextContent('tech-article');
    expect(screen.getByTestId('series-list')).toHaveTextContent('flink-mastery');
  });

  it('shows only series section when type query is series', () => {
    mockQueryString = 'type=series';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(screen.queryByText('최신 아티클')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '시리즈' })
    ).toBeInTheDocument();
  });

  it('updates URL query when type filter is clicked', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    fireEvent.click(screen.getByRole('button', { name: '시리즈' }));

    expect(mockReplace).toHaveBeenCalledWith('/engineering?type=series', {
      scroll: false,
    });
  });

  it('updates URL query when tag filter is clicked', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    fireEvent.click(screen.getByRole('button', { name: '#Redis' }));

    expect(mockReplace).toHaveBeenCalledWith('/engineering?tag=Redis', {
      scroll: false,
    });
  });

  it('normalizes invalid tag query to default URL', () => {
    mockQueryString = 'tag=Unknown';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(mockReplace).toHaveBeenCalledWith('/engineering', {
      scroll: false,
    });
  });
});
