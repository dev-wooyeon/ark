'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/infra/analytics/lib/analytics';
import { observePageScroll } from '@/ui/scroll/page-scroll';

interface ScrollDepthTrackerProps {
  slug: string;
}

const DEPTH_MILESTONES = [25, 50, 75, 100] as const;

export default function ScrollDepthTracker({ slug }: ScrollDepthTrackerProps) {
  const sentMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    sentMilestonesRef.current = new Set();

    return observePageScroll(({ progress, scrollableDistance }) => {
      if (scrollableDistance === 0) return;

      const scrollPercent = Math.round(progress * 100);

      for (const milestone of DEPTH_MILESTONES) {
        if (
          scrollPercent >= milestone &&
          !sentMilestonesRef.current.has(milestone)
        ) {
          sentMilestonesRef.current.add(milestone);
          trackEvent('scroll_depth', {
            slug,
            depth: milestone,
          });
        }
      }
    });
  }, [slug]);

  return null;
}
