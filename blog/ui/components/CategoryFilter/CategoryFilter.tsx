'use client';

import { clsx } from 'clsx';

type Category = 'All' | 'Tech' | 'Life';
type CategoryFilterVariant = 'links' | 'pills';

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
  variant?: CategoryFilterVariant;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
  variant = 'pills',
}: CategoryFilterProps) {
  const isLinkVariant = variant === 'links';

  return (
    <nav aria-label="글 분류">
      <div
        className={clsx(
          'flex flex-wrap items-center',
          isLinkVariant ? 'gap-x-5 gap-y-1' : 'gap-2'
        )}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={clsx(
              'inline-flex min-h-11 items-center text-sm transition-colors duration-[var(--duration-200)] ease-[var(--ease-default)]',
              isLinkVariant
                ? 'border-b-2 px-0 py-2 font-medium'
                : 'gap-2 rounded-[var(--radius-selection)] border px-4 py-2',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
              isLinkVariant
                ? activeCategory === category
                  ? 'border-[var(--color-toss-blue)] text-[var(--color-toss-blue)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-grey-300)] hover:text-[var(--color-text-primary)]'
                : activeCategory === category
                  ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-[var(--color-accent-foreground)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]'
            )}
            aria-pressed={activeCategory === category}
          >
            <span className={clsx(!isLinkVariant && 'font-medium')}>
              {CATEGORY_LABELS[category]}
            </span>
            {isLinkVariant ? (
              <span className="ml-1 text-meta font-normal text-[var(--color-text-tertiary)]">
                ({categoryCounts[category]})
              </span>
            ) : (
              <span
                className={clsx(
                  'rounded-[var(--radius-selection)] px-1.5 py-0.5 text-[10px] font-semibold',
                  activeCategory === category
                    ? 'bg-[var(--color-grey-700)] text-[var(--color-accent-foreground)]'
                    : 'bg-[var(--color-grey-100)] text-[var(--color-text-tertiary)]'
                )}
              >
                {categoryCounts[category]}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

export type { CategoryFilterProps, Category, CategoryFilterVariant };
