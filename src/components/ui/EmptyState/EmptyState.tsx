import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button';
import { ButtonVariant } from '../Button/Button.types';

type EmptyStateVariant = 'default' | 'search' | 'error';
type EmptyStateSize = 'sm' | 'md';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: ButtonVariant;
  };
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  className?: string;
}

const variantStyles: Record<
  EmptyStateVariant,
  { icon: string; title: string; description: string }
> = {
  default: {
    icon: 'text-[var(--color-grey-300)]',
    title: 'text-[var(--color-grey-900)]',
    description: 'text-[var(--color-grey-600)]',
  },
  search: {
    icon: 'text-[var(--color-toss-blue)]',
    title: 'text-[var(--color-grey-900)]',
    description: 'text-[var(--color-grey-600)]',
  },
  error: {
    icon: 'text-[var(--color-error)]',
    title: 'text-[var(--color-grey-900)]',
    description: 'text-[var(--color-grey-600)]',
  },
};

const sizeStyles: Record<EmptyStateSize, { container: string; icon: string }> =
  {
    sm: {
      container: 'py-12 px-5',
      icon: 'text-4xl',
    },
    md: {
      container: 'py-16 px-6',
      icon: 'text-5xl',
    },
  };

export default function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  size = 'md',
  className,
}: EmptyStateProps) {
  const tone = variantStyles[variant];
  const scale = sizeStyles[size];

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center',
        scale.container,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className={clsx('mb-4', tone.icon, scale.icon)} aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className={clsx('mb-2 text-lg font-semibold', tone.title)}>
        {title}
      </h3>
      {description && (
        <p className={clsx('mb-6 max-w-sm text-sm', tone.description)}>
          {description}
        </p>
      )}
      {action &&
        (action.href ? (
          <Button
            as="a"
            href={action.href}
            variant={action.variant ?? 'secondary'}
          >
            {action.label}
          </Button>
        ) : (
          <Button
            variant={action.variant ?? 'secondary'}
            onClick={action.onClick}
            disabled={!action.onClick}
          >
            {action.label}
          </Button>
        ))}
    </div>
  );
}

export type { EmptyStateProps, EmptyStateVariant, EmptyStateSize };
