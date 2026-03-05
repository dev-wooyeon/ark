import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

function createArticle(index: number): FeedData {
  return {
    slug: `tech-article-${index}`,
    title: `Tech Article ${index}`,
    description: 'article',
    date: `2026-03-${String(index).padStart(2, '0')}`,
    category: 'Tech',
    tags: ['Redis'],
  };
}

const samplePosts: FeedData[] = [
  createArticle(1),
  createArticle(2),
  createArticle(3),
  createArticle(4),
  createArticle(5),
  createArticle(6),
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

  it('renders type filters and both sections by default', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    expect(screen.getByRole('button', { name: '전체' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '아티클' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '시리즈' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '#Redis' })).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '아티클' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '시리즈' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('post-list')).toHaveTextContent('tech-article-1');
    expect(screen.getByTestId('post-list')).not.toHaveTextContent(
      'tech-article-6'
    );
    expect(screen.getByTestId('series-list')).toHaveTextContent('flink-mastery');
  });

  it('shows only series section when type query is series', () => {
    mockQueryString = 'type=series';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(
      screen.queryByRole('heading', { level: 2, name: '아티클' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: '시리즈' })
    ).toBeInTheDocument();
  });

  it('shows only article section when type query is article', () => {
    mockQueryString = 'type=article';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(
      screen.getByRole('heading', { level: 2, name: '아티클' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: '시리즈' })
    ).not.toBeInTheDocument();
  });

  it('updates URL query when type filter is clicked', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    fireEvent.click(screen.getByRole('button', { name: '시리즈' }));

    expect(mockReplace).toHaveBeenCalledWith('/engineering?type=series', {
      scroll: false,
    });
  });

  it('clears type query when 전체 filter is clicked', () => {
    mockQueryString = 'type=series';

    render(<EngineeringPageClient posts={samplePosts} />);

    fireEvent.click(screen.getByRole('button', { name: '전체' }));

    expect(mockReplace).toHaveBeenCalledWith('/engineering', {
      scroll: false,
    });
  });

  it('updates page query when pagination button is clicked', () => {
    render(<EngineeringPageClient posts={samplePosts} />);

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(mockReplace).toHaveBeenCalledWith('/engineering?page=2', {
      scroll: false,
    });
  });

  it('shows second page posts when page query exists', () => {
    mockQueryString = 'page=2';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(screen.getByTestId('post-list')).toHaveTextContent('tech-article-6');
    expect(screen.getByTestId('post-list')).not.toHaveTextContent(
      'tech-article-1'
    );
  });

  it('normalizes invalid type query to default URL', () => {
    mockQueryString = 'type=unknown';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(mockReplace).toHaveBeenCalledWith('/engineering', {
      scroll: false,
    });
  });

  it('normalizes invalid page query to default URL', () => {
    mockQueryString = 'page=99';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(mockReplace).toHaveBeenCalledWith('/engineering?page=2', {
      scroll: false,
    });
  });

  it('removes legacy tag query and keeps valid type query', () => {
    mockQueryString = 'type=series&tag=Redis';

    render(<EngineeringPageClient posts={samplePosts} />);

    expect(mockReplace).toHaveBeenCalledWith('/engineering?type=series', {
      scroll: false,
    });
  });
});
