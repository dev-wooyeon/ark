'use client';

import { useDeferredValue, useMemo, useState } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortOrder, setSortOrder] = useState<HomeSortOrder>('latest');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const categoryCounts = useMemo(() => buildHomeCategoryCounts(posts), [posts]);
  const filteredPosts = useMemo(
    () =>
      filterHomePosts(posts, popularViews, {
        query: deferredSearchQuery,
        category: activeCategory,
        sortOrder,
      }),
    [activeCategory, deferredSearchQuery, popularViews, posts, sortOrder]
  );

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOrder)?.label ??
    '최신순';

  return (
    <Container size="md" className="py-8 md:py-10">
      <div className="space-y-5">
        <section className="rounded-3xl border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-grey-500)]">
                Archive
              </p>
              <p className="mt-2 text-sm text-[var(--color-grey-600)]">
                {filteredPosts.length}개의 글
                <span className="mx-2 text-[var(--color-grey-300)]">•</span>
                {activeSortLabel}
              </p>
            </div>

            {deferredSearchQuery.trim() ? (
              <p className="text-sm text-[var(--color-grey-500)]">
                &quot;{deferredSearchQuery.trim()}&quot; 검색 결과
              </p>
            ) : null}
          </div>

          <label htmlFor="home-feed-search" className="sr-only">
            홈 피드 검색
          </label>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-4 py-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-[var(--color-grey-500)]"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="home-feed-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="글 제목, 설명, 태그로 검색해보세요"
              className="w-full bg-transparent text-sm text-[var(--color-grey-900)] outline-none placeholder:text-[var(--color-grey-400)]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CategoryFilter
              categories={FEED_CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={categoryCounts}
            />

            <div
              className="inline-flex rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] p-1"
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
