'use client';

import { clsx } from 'clsx';

type Category = 'All' | 'Dev' | 'Life';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'px-4 py-2 text-sm rounded-full transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
            'active:scale-95',
            activeCategory === category
              ? 'bg-[var(--color-toss-blue)] text-white font-bold shadow-md'
              : 'bg-[var(--color-grey-50)] text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] font-medium'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export type { CategoryFilterProps, Category };
