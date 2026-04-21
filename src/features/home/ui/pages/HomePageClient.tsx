'use client';

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import {
  CategoryFilter,
  PostList,
  type Category,
} from '@/features/blog/ui/components';
import {
  buildHomeCategoryCounts,
  filterHomePosts,
  type HomePopularView,
  type HomeSortOrder,
} from '@/features/home/model/home-feed';
import { Container } from '@/shared/layout';

interface HomePageClientProps {
  posts: FeedData[];
  popularViews: HomePopularView[];
}

const FEED_CATEGORIES: Category[] = ['All', 'Tech', 'Life'];
const SORT_OPTIONS: Array<{ value: HomeSortOrder; label: string }> = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
];

export default function HomePageClient({
  posts,
  popularViews,
}: HomePageClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortOrder, setSortOrder] = useState<HomeSortOrder>('latest');

  const categoryCounts = useMemo(() => buildHomeCategoryCounts(posts), [posts]);
  const filteredPosts = useMemo(
    () =>
      filterHomePosts(posts, popularViews, {
        query: '',
        category: activeCategory,
        sortOrder,
      }),
    [activeCategory, popularViews, posts, sortOrder]
  );

  return (
    <Container size="md" className="py-8 md:py-10">
      <div className="space-y-5">
        <section className="rounded-[28px] border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="-mx-1 overflow-x-auto px-1 pb-1 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
              <div className="min-w-max md:min-w-0">
                <CategoryFilter
                  categories={FEED_CATEGORIES}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  categoryCounts={categoryCounts}
                />
              </div>
            </div>

            <div
              className="grid w-full grid-cols-2 rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] p-1 md:inline-flex md:w-auto"
              role="tablist"
              aria-label="정렬"
            >
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSortOrder(option.value)}
                  className={clsx(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    sortOrder === option.value
                      ? 'bg-[var(--color-bg-primary)] text-[var(--color-grey-900)] shadow-sm'
                      : 'text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]'
                  )}
                  aria-pressed={sortOrder === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <PostList posts={filteredPosts} layout="list" />
      </div>
    </Container>
  );
}

export type { HomePageClientProps };
