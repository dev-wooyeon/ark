'use client';

import { motion } from 'framer-motion';
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
    <div className="flex gap-2 p-1 bg-[var(--color-grey-100)] rounded-[12px] w-fit">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={clsx(
            'relative px-4 py-2 text-sm font-medium rounded-[var(--radius-sm)]',
            'transition-colors duration-[var(--duration-150)]',
            activeCategory === category
              ? 'text-white'
              : 'text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)]'
          )}
        >
          {activeCategory === category && (
            <motion.div
              layoutId="category-indicator"
              className="absolute inset-0 bg-[var(--color-grey-900)] rounded-[var(--radius-sm)]"
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-10">{category}</span>
        </button>
      ))}
    </div>
  );
}

export type { CategoryFilterProps, Category };
