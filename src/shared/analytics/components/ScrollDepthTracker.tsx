'use client';

import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '@/shared/analytics/lib/analytics';

interface ScrollDepthTrackerProps {
    slug: string;
}

const DEPTH_MILESTONES = [25, 50, 75, 100] as const;

export default function ScrollDepthTracker({ slug }: ScrollDepthTrackerProps) {
    const sentMilestonesRef = useRef<Set<number>>(new Set());

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const documentHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        if (documentHeight <= 0) return;

        const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

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
    }, [slug]);

    useEffect(() => {
        sentMilestonesRef.current = new Set();

        let ticking = false;
        const throttledScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });

        // 초기 스크롤 위치 체크 (페이지 중간에서 새로고침 등)
        handleScroll();

        return () => {
            window.removeEventListener('scroll', throttledScroll);
        };
    }, [handleScroll]);

    return null;
}
