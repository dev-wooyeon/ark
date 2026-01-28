import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="mb-4 text-[var(--color-grey-300)] text-5xl" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[var(--color-grey-600)] mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button variant="secondary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export type { EmptyStateProps };
