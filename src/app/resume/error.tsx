'use client';

import { useEffect } from 'react';
import { RouteError } from '@/components/ui';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

interface ResumeErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ResumeErrorProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.error, {
      source: 'route_resume',
      message: error.message,
    });
  }, [error]);

  return (
    <RouteError
      title="이력서 정보를 불러오지 못했습니다"
      description="페이지를 다시 시도하거나 잠시 후 새로고침해 주세요."
      onRetry={reset}
    />
  );
}
