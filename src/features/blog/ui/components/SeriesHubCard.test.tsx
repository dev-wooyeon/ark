import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { SeriesSummary } from '@/features/blog/model/series-group';
import SeriesHubCard from './SeriesHubCard';

vi.mock('./SeriesTrackedLink', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

const summary: SeriesSummary = {
  id: 'redis-deep-dive',
  title: 'Redis 완전정복',
  latestDate: '2026-03-10',
  firstPostSlug: 'redis-1',
  postCount: 2,
  totalReadingMinutes: 18,
  posts: [
    {
      slug: 'redis-1',
      title: 'Redis 1편',
      description: '기초를 다뤄요',
      date: '2026-03-01',
      category: 'Tech',
      tags: ['Redis'],
      readingTime: 8,
      series: {
        id: 'redis-deep-dive',
        title: 'Redis 완전정복',
        order: 1,
      },
    },
    {
      slug: 'redis-2',
      title: 'Redis 2편',
      description: '심화를 다뤄요',
      date: '2026-03-10',
      category: 'Tech',
      tags: ['Redis'],
      readingTime: 10,
      series: {
        id: 'redis-deep-dive',
        title: 'Redis 완전정복',
        order: 2,
      },
    },
  ],
};

describe('SeriesHubCard', () => {
  it('renders series title and links without the redundant series badge', () => {
    render(<SeriesHubCard summary={summary} seriesIndex={0} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Redis 완전정복' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /첫 글부터 읽기/i })
    ).toHaveAttribute('href', '/blog/redis-1');
    const firstEpisodeLink = screen.getByRole('link', {
      name: /1\.?\s*Redis 1편/i,
    });

    expect(firstEpisodeLink).toHaveAttribute('href', '/blog/redis-1');
    expect(firstEpisodeLink).toHaveClass('min-h-10', 'py-1.5');
    expect(screen.queryByText('Series')).not.toBeInTheDocument();
  });
});
