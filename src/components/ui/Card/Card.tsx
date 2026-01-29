import { forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  as?: 'div' | 'article' | 'section';
}

interface CardLinkProps extends Omit<CardProps, 'as'> {
  as: 'a';
  href: string;
}

type CardComponentProps = CardProps | CardLinkProps;

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowStyles = {
  none: '',
  sm: 'shadow-[var(--shadow-sm)]',
  md: 'shadow-[var(--shadow-md)]',
  lg: 'shadow-[var(--shadow-lg)]',
};

const Card = forwardRef<HTMLDivElement | HTMLAnchorElement, CardComponentProps>(
  function Card(props, ref) {
    const {
      children,
      className,
      padding = 'md',
      shadow = 'none',
      hover = false,
      as = 'div',
    } = props;

    const baseStyles = clsx(
      'bg-white rounded-[var(--radius-md)] border border-[var(--color-grey-200)]',
      paddingStyles[padding],
      shadowStyles[shadow],
      hover && [
        'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
        'hover:shadow-[var(--shadow-md)] hover:border-[var(--color-grey-300)]',
        'hover:-translate-y-0.5',
        'cursor-pointer',
      ],
      className
    );

    if ('as' in props && props.as === 'a') {
      const { href } = props as CardLinkProps;
      return (
        <a
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={baseStyles}
        >
          {children}
        </a>
      );
    }

    const Component = as as 'div' | 'article' | 'section';
    return (
      <Component ref={ref as React.Ref<HTMLDivElement>} className={baseStyles}>
        {children}
      </Component>
    );
  }
) as any;

// Compound Components
Card.Header = function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('mb-4', className)}>{children}</div>;
};

Card.Title = function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={clsx(
        'text-lg font-semibold text-[var(--color-grey-900)] leading-tight',
        className
      )}
    >
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        'text-sm text-[var(--color-grey-600)] leading-relaxed',
        className
      )}
    >
      {children}
    </p>
  );
};

Card.Content = function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
};

Card.Footer = function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx('mt-4 pt-4 border-t border-[var(--color-grey-100)]', className)}
    >
      {children}
    </div>
  );
};

export default Card;
export type { CardProps, CardLinkProps, CardComponentProps };
