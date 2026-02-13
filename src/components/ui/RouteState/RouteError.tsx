'use client';

import { clsx } from 'clsx';
import { EmptyState } from '@/components/ui/EmptyState';

interface RouteErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function RouteError({
  title = '문제가 발생했습니다',
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
  className,
}: RouteErrorProps) {
  return (
    <div
      className={clsx('flex min-h-96 items-center justify-center', className)}
    >
      <EmptyState
        icon={<span>⚠️</span>}
        title={title}
        description={description}
        variant="error"
        action={
          onRetry
            ? {
                label: '다시 시도',
                onClick: onRetry,
              }
            : undefined
        }
      />
    </div>
  );
}

export type { RouteErrorProps };
