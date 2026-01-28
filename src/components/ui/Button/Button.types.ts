import { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps> & {
    as?: 'button';
  };

export type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof ButtonBaseProps> & {
    as: 'a';
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;
