'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonAsButton,
} from './Button.types';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-toss-blue)] text-white hover:opacity-80 active:scale-[0.98]',
  secondary:
    'bg-[var(--color-grey-100)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)] active:scale-[0.98]',
  tertiary:
    'bg-transparent text-[var(--color-toss-blue)] hover:bg-[var(--color-grey-50)] active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-[var(--radius-sm)]',
  md: 'h-11 px-4 text-base rounded-[var(--radius-sm)]',
  lg: 'h-13 px-6 text-lg rounded-[var(--radius-sm)]',
};

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className,
      ...rest
    } = props;

    const baseStyles = clsx(
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all',
      'duration-[var(--duration-150)] ease-[var(--ease-default)]',
      'focus-visible:outline-2 focus-visible:outline-[var(--color-toss-blue)] focus-visible:outline-offset-2',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {loading ? (
          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </>
    );

    if ('as' in rest && rest.as === 'a') {
      const { as, href, ...anchorProps } = rest;
      // Check if it's an external link
      const isExternal =
        typeof href === 'string' &&
        (href.startsWith('http') || href.startsWith('mailto:'));

      if (isExternal) {
        return (
          <a
            href={href}
            {...anchorProps}
            ref={ref as React.Ref<HTMLAnchorElement>}
            className={baseStyles}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          href={href || ''}
          {...anchorProps}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseStyles}
        >
          {content}
        </Link>
      );
    }

    const { as, ...buttonProps } = rest as ButtonAsButton;
    return (
      <button
        {...buttonProps}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || loading}
        className={baseStyles}
      >
        {content}
      </button>
    );
  }
);

export default Button;

// Re-export types
export type { ButtonProps, ButtonVariant, ButtonSize };
