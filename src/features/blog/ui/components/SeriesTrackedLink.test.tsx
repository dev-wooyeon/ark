import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SeriesTrackedLink from './SeriesTrackedLink';

const mockTrackEvent = vi.fn();

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    onClick,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }) => {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </a>
    );
  },
}));

vi.mock('@/shared/analytics/lib/analytics', () => ({
  AnalyticsEvents: {
    click: 'click',
  },
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

describe('SeriesTrackedLink', () => {
  it('tracks start CTA click with expected payload', () => {
    mockTrackEvent.mockClear();

    render(
      <SeriesTrackedLink
        href="/blog/redis-1"
        target="series_hub_start"
        seriesId="redis"
        seriesTitle="Redis Deep Dive"
        postSlug="redis-1"
        episodeOrder={1}
        seriesIndex={0}
      >
        첫 글부터 읽기
      </SeriesTrackedLink>
    );

    fireEvent.click(screen.getByRole('link', { name: '첫 글부터 읽기' }));

    expect(mockTrackEvent).toHaveBeenCalledWith('click', {
      target: 'series_hub_start',
      series_id: 'redis',
      series_title: 'Redis Deep Dive',
      post_slug: 'redis-1',
      episode_order: 1,
      series_index: 0,
    });
  });

  it('tracks episode click with episode metadata', () => {
    mockTrackEvent.mockClear();

    render(
      <SeriesTrackedLink
        href="/blog/redis-2"
        target="series_hub_episode"
        seriesId="redis"
        seriesTitle="Redis Deep Dive"
        postSlug="redis-2"
        episodeOrder={2}
        seriesIndex={1}
      >
        2. Redis 심화
      </SeriesTrackedLink>
    );

    fireEvent.click(screen.getByRole('link', { name: '2. Redis 심화' }));

    expect(mockTrackEvent).toHaveBeenCalledWith('click', {
      target: 'series_hub_episode',
      series_id: 'redis',
      series_title: 'Redis Deep Dive',
      post_slug: 'redis-2',
      episode_order: 2,
      series_index: 1,
    });
  });
});
