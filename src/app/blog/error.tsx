'use client';

import { useEffect } from 'react';
import { RouteError } from '@/components/ui';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

interface BlogErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: BlogErrorProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.error, {
      source: 'route_blog',
      message: error.message,
    });
  }, [error]);

  return (
    <RouteError
      title="블로그 목록을 불러오지 못했습니다"
      description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
      onRetry={reset}
    />
  );
}
