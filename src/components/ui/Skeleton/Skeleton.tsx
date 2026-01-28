import { clsx } from 'clsx';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
  animate?: boolean;
}

export default function Skeleton({
  width,
  height,
  variant = 'text',
  className,
  animate = true,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded-[4px]',
    circular: 'rounded-full',
    rectangular: 'rounded-[var(--radius-sm)]',
  };

  return (
    <div
      className={clsx(
        'bg-[var(--color-grey-100)]',
        variantStyles[variant],
        animate && 'animate-pulse',
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height:
          typeof height === 'number'
            ? `${height}px`
            : height || (variant === 'text' ? '1em' : undefined),
      }}
      aria-hidden="true"
    />
  );
}

// Preset components
Skeleton.Text = function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
          height={16}
        />
      ))}
    </div>
  );
};

Skeleton.Avatar = function SkeletonAvatar({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

Skeleton.Card = function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'p-6 rounded-[var(--radius-md)] border border-[var(--color-grey-200)] bg-white',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton.Text lines={2} />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width={60} height={24} />
          <Skeleton variant="rectangular" width={60} height={24} />
        </div>
      </div>
    </div>
  );
};

export type { SkeletonProps };
