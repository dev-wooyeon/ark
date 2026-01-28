import Link from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

interface CardProps extends ComponentPropsWithoutRef<'div'> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    as?: 'div' | 'article' | 'section';
}

interface CardLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    as: 'link';
}

type CardComponentProps = CardProps | CardLinkProps;

export default function Card(allProps: CardComponentProps) {
    const {
        children,
        className = '',
        hover = false,
        as = 'div',
    } = allProps;

    const baseStyles = 'rounded-lg border border-border bg-primary p-6 transition-all duration-200';
    const hoverStyles = hover
        ? 'hover:shadow-md hover:border-accent cursor-pointer'
        : '';
    const combinedClassName = `${baseStyles} ${hoverStyles} ${className}`;

    if (allProps.as === 'link') {
        const { as: _, hover: __, className: ___, children: ____, ...linkProps } = allProps;
        return (
            <Link {...linkProps} className={combinedClassName}>
                {children}
            </Link>
        );
    }

    const { as: _, hover: __, className: ___, children: ____, ...divProps } = allProps;
    const Component = as as 'div' | 'article' | 'section';
    return (
        <Component {...divProps} className={combinedClassName}>
            {children}
        </Component>
    );
}

// Sub-components for better composition
Card.Header = function CardHeader({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
};

Card.Title = function CardTitle({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <h3 className={`text-lg font-semibold text-text-primary ${className}`}>{children}</h3>;
};

Card.Description = function CardDescription({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <p className={`text-sm text-text-secondary ${className}`}>{children}</p>;
};

Card.Content = function CardContent({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`mt-4 pt-4 border-t border-border ${className}`}>{children}</div>;
};
