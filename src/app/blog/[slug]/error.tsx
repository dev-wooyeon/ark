'use client';

import { useEffect } from 'react';
import { RouteError } from '@/components/ui';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

interface BlogPostErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: BlogPostErrorProps) {
  useEffect(() => {
    trackEvent(AnalyticsEvents.error, {
      source: 'route_blog_post',
      message: error.message,
    });
  }, [error]);

  return (
    <RouteError
      title="게시글을 표시할 수 없습니다"
      description="문제가 계속되면 블로그 목록에서 다른 글을 열어보세요."
      onRetry={reset}
    />
  );
}
