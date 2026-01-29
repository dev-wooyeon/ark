'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react';
import { clsx } from 'clsx';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-9 text-sm px-3',
  md: 'h-11 text-base px-4',
  lg: 'h-[52px] text-lg px-5',
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    leftIcon,
    rightIcon,
    size = 'md',
    fullWidth = false,
    className,
    disabled,
    ...props
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={clsx('flex flex-col gap-2', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-[var(--color-grey-700)]">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-grey-500)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={clsx(
            'w-full rounded-[var(--radius-sm)] border bg-white',
            'transition-all duration-[var(--duration-150)] ease-[var(--ease-default)]',
            'placeholder:text-[var(--color-grey-400)]',
            sizeStyles[size],
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error
              ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error)]/20'
              : isFocused
              ? 'border-[var(--color-toss-blue)] ring-2 ring-[var(--color-toss-blue)]/20'
              : 'border-[var(--color-grey-200)] hover:border-[var(--color-grey-300)]',
            disabled && 'bg-[var(--color-grey-50)] cursor-not-allowed opacity-60',
            className
          )}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-grey-500)]">
            {rightIcon}
          </span>
        )}
      </div>
      {(helperText || error) && (
        <span
          className={clsx(
            'text-sm',
            error ? 'text-[var(--color-error)]' : 'text-[var(--color-grey-500)]'
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
});

export default Input;
export type { InputProps };
