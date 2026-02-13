import { clsx } from 'clsx';

interface RouteLoadingProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function RouteLoading({
  title = '페이지를 불러오는 중입니다',
  description = '잠시만 기다려 주세요.',
  className,
}: RouteLoadingProps) {
  return (
    <div
      className={clsx(
        'flex min-h-96 items-center justify-center px-6 py-16',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-grey-300)] border-t-[var(--color-toss-blue)]" />
        <p className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">
          {title}
        </p>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}

export type { RouteLoadingProps };
