import React from 'react';

interface ImageGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: number;
}

export const ImageGrid = ({ children, cols = 2, gap = 16 }: ImageGridProps) => {
  const gridCols =
    {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-2 sm:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4',
    }[cols] || 'grid-cols-2';

  return (
    <div
      className={`grid ${gridCols} w-full my-12 
        [&_p]:contents 
        [&_span:not([class*='text-'])]:!m-0 [&_span:not([class*='text-'])]:!p-0 [&_span:not([class*='text-'])]:!border-0 [&_span:not([class*='text-'])]:!rounded-none [&_span:not([class*='text-'])]:block
        [&_img]:!m-0 [&_img]:!border-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:rounded-xl`}
      style={{ gap: `${gap}px` }}
    >
      {children}
    </div>
  );
};
