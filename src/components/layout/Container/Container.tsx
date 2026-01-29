import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  as?: 'div' | 'main' | 'section' | 'article';
}

const sizeStyles = {
  sm: 'max-w-[640px]',
  md: 'max-w-[800px]',
  lg: 'max-w-[1000px]',
  xl: 'max-w-[1200px]',
};

export default function Container({
  children,
  size = 'lg',
  className,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component className={clsx('mx-auto px-6 md:px-8', sizeStyles[size], className)}>
      {children}
    </Component>
  );
}

export type { ContainerProps };
