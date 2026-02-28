'use client';

import { clsx } from 'clsx';

type Category = 'All' | 'Tech' | 'Life';

const CATEGORY_LABELS: Record<Category, string> = {
  All: 'All',
  Tech: 'Tech',
  Life: 'Life',
};

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  categoryCounts: Record<Category, number>;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
            'active:translate-y-px',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
            activeCategory === category
              ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white shadow-sm'
              : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]'
          )}
          aria-pressed={activeCategory === category}
        >
          <span className="font-medium">{CATEGORY_LABELS[category]}</span>
          <span
            className={clsx(
              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
              activeCategory === category
                ? 'bg-white/20 text-white'
                : 'bg-[var(--color-grey-100)] text-[var(--color-text-tertiary)]'
            )}
          >
            {categoryCounts[category]}
          </span>
        </button>
      ))}
    </div>
  );
}

export type { CategoryFilterProps, Category };
