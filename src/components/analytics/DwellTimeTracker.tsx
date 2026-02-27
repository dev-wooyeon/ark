'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface DwellTimeTrackerProps {
  slug: string;
}

export default function DwellTimeTracker({ slug }: DwellTimeTrackerProps) {
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const sentRef = useRef<boolean>(false);
  const lastCheckpointSecondsRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = Date.now();
    accumulatedRef.current = 0;
    sentRef.current = false;
    isVisibleRef.current = true;
    lastCheckpointSecondsRef.current = 0;

    const getActiveSeconds = () => {
      const activeTime = isVisibleRef.current
        ? accumulatedRef.current + (Date.now() - startTimeRef.current)
        : accumulatedRef.current;

      return Math.round(activeTime / 1000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 탭 전환: 누적 시간 저장
        accumulatedRef.current += Date.now() - startTimeRef.current;
        isVisibleRef.current = false;
      } else {
        // 탭 복귀: 타이머 재시작
        startTimeRef.current = Date.now();
        isVisibleRef.current = true;
      }
    };

    const sendDwellTime = () => {
      if (sentRef.current) return;

      const seconds = getActiveSeconds();
      if (seconds < 3) return; // 3초 미만은 무시

      sentRef.current = true;
      trackEvent('dwell_time', {
        slug,
        seconds,
      });
    };

    const handleBeforeUnload = () => {
      sendDwellTime();
    };

    // 주기적 체크포인트 (30초마다)
    const intervalId = setInterval(() => {
      if (document.hidden || !isVisibleRef.current || sentRef.current) {
        return;
      }

      const seconds = getActiveSeconds();

      if (seconds < 3 || seconds <= lastCheckpointSecondsRef.current) {
        return;
      }

      lastCheckpointSecondsRef.current = seconds;
      trackEvent('dwell_time', { slug, seconds });
    }, 30_000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      sendDwellTime();
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [slug]);

  return null;
}
