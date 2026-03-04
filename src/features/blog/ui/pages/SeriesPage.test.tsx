import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import type { SeriesSummary } from '@/features/blog/model/series-group';
import SeriesPage from './SeriesPage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);
const mockGetSeriesSummaries = vi.fn<(posts: FeedData[]) => SeriesSummary[]>(() => []);

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/shared/layout', () => ({
  Header: () => <div data-testid="mock-header" />,
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('@/features/blog/model/series-group', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/blog/model/series-group')
  >('@/features/blog/model/series-group');

  return {
    ...actual,
    getSeriesSummaries: (posts: FeedData[]) => mockGetSeriesSummaries(posts),
  };
});

describe('SeriesPage', () => {
  it('renders series cards and summary stats', () => {
    mockGetSortedFeedData.mockReturnValue([]);
    mockGetSeriesSummaries.mockReturnValue([
      {
        id: 'redis',
        title: 'Redis 완전정복',
        latestDate: '2026-02-07',
        firstPostSlug: 'redis-1',
        postCount: 2,
        totalReadingMinutes: 30,
        posts: [
          {
            slug: 'redis-1',
            title: 'Redis 1',
            description: 'redis intro',
            date: '2026-02-01',
            category: 'Tech',
            series: { id: 'redis', title: 'Redis 완전정복', order: 1 },
          },
          {
            slug: 'redis-2',
            title: 'Redis 2',
            description: 'redis advanced',
            date: '2026-02-07',
            category: 'Tech',
            series: { id: 'redis', title: 'Redis 완전정복', order: 2 },
          },
        ],
      },
    ]);

    render(<SeriesPage />);

    expect(screen.getByText('시리즈')).toBeInTheDocument();
    expect(screen.getByText('1개 시리즈 · 2개 글')).toBeInTheDocument();
    expect(screen.getByText('Redis 완전정복')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /첫 글부터 읽기/i })).toHaveAttribute(
      'href',
      '/blog/redis-1'
    );
  });

  it('renders shared empty state when no series exists', () => {
    mockGetSortedFeedData.mockReturnValue([]);
    mockGetSeriesSummaries.mockReturnValue([]);

    render(<SeriesPage />);

    expect(screen.getByText('아직 등록된 시리즈가 없어요')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Engineering 둘러보기' })
    ).toHaveAttribute(
      'href',
      '/engineering'
    );
  });

  it('does not render start CTA when first post slug is missing', () => {
    mockGetSortedFeedData.mockReturnValue([]);
    mockGetSeriesSummaries.mockReturnValue([
      {
        id: 'flink',
        title: 'Flink 완전 정복',
        latestDate: '2026-02-08',
        firstPostSlug: null,
        postCount: 1,
        totalReadingMinutes: 12,
        posts: [
          {
            slug: 'flink-1',
            title: 'Flink 1',
            description: 'flink intro',
            date: '2026-02-08',
            category: 'Tech',
            readingTime: 12,
            series: { id: 'flink', title: 'Flink 완전 정복', order: 1 },
          },
        ],
      },
    ]);

    render(<SeriesPage />);

    expect(
      screen.queryByRole('link', { name: /첫 글부터 읽기/i })
    ).not.toBeInTheDocument();
  });
});
