'use client';

import { clsx } from 'clsx';

interface RouteErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export default function RouteError({
  title = '이 페이지를 표시할 수 없습니다',
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
  className,
}: RouteErrorProps) {
  return (
    <main className={clsx('ark-route-error', className)}>
      <section
        aria-live="polite"
        aria-labelledby="route-error-title"
        className="ark-route-error-content"
        role="status"
      >
        <p className="ark-route-error-label">UNAVAILABLE</p>
        <h1 id="route-error-title" className="ark-route-error-title">
          {title}
        </h1>
        {description ? (
          <p className="ark-route-error-description">{description}</p>
        ) : null}
        {onRetry ? (
          <button
            className="ark-route-error-retry"
            onClick={onRetry}
            type="button"
          >
            다시 시도
          </button>
        ) : null}
      </section>
    </main>
  );
}

export type { RouteErrorProps };
