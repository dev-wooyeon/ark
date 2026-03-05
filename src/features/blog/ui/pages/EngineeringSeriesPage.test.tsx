import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import EngineeringSeriesPage from './EngineeringSeriesPage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);
const mockNotFound = vi.fn(() => {
  throw new Error('NOT_FOUND');
});

vi.mock('@/shared/layout', () => ({
  Header: () => <div data-testid="mock-header" />,
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    notFound: () => mockNotFound(),
  };
});

describe('EngineeringSeriesPage', () => {
  beforeEach(() => {
    mockGetSortedFeedData.mockReset();
    mockNotFound.mockClear();
  });

  it('renders selected series episodes in order', () => {
    mockGetSortedFeedData.mockReturnValue([
      {
        slug: 'redis-2',
        title: 'Redis 2편',
        description: '두 번째 글',
        date: '2026-03-02',
        category: 'Tech',
        series: { id: 'redis', title: 'Redis 완전정복', order: 2 },
      },
      {
        slug: 'redis-1',
        title: 'Redis 1편',
        description: '첫 번째 글',
        date: '2026-03-01',
        category: 'Tech',
        series: { id: 'redis', title: 'Redis 완전정복', order: 1 },
      },
      {
        slug: 'life-1',
        title: 'Life 글',
        description: '제외',
        date: '2026-03-03',
        category: 'Life',
      },
    ]);

    render(<EngineeringSeriesPage seriesId="redis" />);

    expect(screen.getByText('Redis 완전정복')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: /글 보기/ });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/blog/redis-1');
    expect(links[1]).toHaveAttribute('href', '/blog/redis-2');
  });

  it('calls notFound when series does not exist', () => {
    mockGetSortedFeedData.mockReturnValue([
      {
        slug: 'tech-1',
        title: 'Tech 글',
        description: '본문',
        date: '2026-03-01',
        category: 'Tech',
      },
    ]);

    expect(() => render(<EngineeringSeriesPage seriesId="unknown" />)).toThrow(
      'NOT_FOUND'
    );
    expect(mockNotFound).toHaveBeenCalled();
  });
});
