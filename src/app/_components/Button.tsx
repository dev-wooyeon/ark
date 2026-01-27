import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
    Omit<ComponentPropsWithoutRef<'button'>, keyof BaseButtonProps> & {
        as?: 'button';
    };

type ButtonAsLink = BaseButtonProps &
    Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseButtonProps> & {
        as: 'link';
        href: string;
    };

type ButtonAsAnchor = BaseButtonProps &
    Omit<ComponentPropsWithoutRef<'a'>, keyof BaseButtonProps> & {
        as: 'a';
        href: string;
    };

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-accent text-white hover:bg-accent-secondary',
    secondary: 'bg-accent-tertiary text-text-primary hover:bg-accent-tertiary/80',
    ghost: 'bg-transparent text-text-primary hover:bg-accent-tertiary',
    link: 'bg-transparent text-accent underline-offset-2 hover:underline',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles =
        'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if ('as' in props && props.as === 'link') {
        const { as, ...linkProps } = props;
        return (
            <Link {...linkProps} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    if ('as' in props && props.as === 'a') {
        const { as, ...anchorProps } = props;
        return (
            <a {...anchorProps} className={combinedClassName}>
                {children}
            </a>
        );
    }

    const { as, ...buttonProps } = props as ButtonAsButton;
    return (
        <button {...buttonProps} className={combinedClassName}>
            {children}
        </button>
    );
}
