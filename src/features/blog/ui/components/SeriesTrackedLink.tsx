'use client';

import Link from 'next/link';
import type { MouseEvent, ReactNode } from 'react';
import { clsx } from 'clsx';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';

type SeriesTrackedTarget = 'series_hub_start' | 'series_hub_episode';

interface SeriesTrackedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target: SeriesTrackedTarget;
  seriesId: string;
  seriesTitle: string;
  postSlug: string;
  episodeOrder?: number;
  seriesIndex: number;
  ariaLabel?: string;
}

export default function SeriesTrackedLink({
  href,
  children,
  className,
  target,
  seriesId,
  seriesTitle,
  postSlug,
  episodeOrder,
  seriesIndex,
  ariaLabel,
}: SeriesTrackedLinkProps) {
  const handleClick = (_event: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(AnalyticsEvents.click, {
      target,
      series_id: seriesId,
      series_title: seriesTitle,
      post_slug: postSlug,
      episode_order: episodeOrder,
      series_index: seriesIndex,
    });
  };

  return (
    <Link
      href={href}
      className={clsx(className)}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

export type { SeriesTrackedTarget, SeriesTrackedLinkProps };
