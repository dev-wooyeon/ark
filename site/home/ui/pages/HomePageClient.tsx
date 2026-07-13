'use client';

import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { FeedData } from '@/blog/model/types';
import { CategoryFilter, PostList, type Category } from '@/blog/ui/components';
import {
  buildHomeCategoryCounts,
  filterHomePosts,
  selectHomeFeaturedPosts,
  type HomePopularView,
  type HomeSortOrder,
} from '@/site/home/model/home-feed';
import HomeFeaturedPosts from '@/site/home/ui/components/HomeFeaturedPosts';
import { Container } from '@/ui/layout';

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
  const featuredPosts = useMemo(() => selectHomeFeaturedPosts(posts), [posts]);
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
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="text-meta font-semibold uppercase tracking-wide text-[var(--color-toss-blue)]">
            Ark · Engineering Notes
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            시스템을 운영하며 내린 기술적 판단과 실패를 기록합니다
          </h1>
          <p className="mt-3 max-w-2xl text-reading leading-relaxed text-[var(--color-text-secondary)]">
            플랫폼 엔지니어 박우연이 운영, 데이터, 아키텍처에서 얻은 기준을 실제
            사례와 함께 정리합니다.
          </p>
        </header>

        <HomeFeaturedPosts posts={featuredPosts} />

        <section aria-labelledby="home-feed-title" className="space-y-5">
          <div>
            <p className="text-meta font-semibold text-[var(--color-text-tertiary)]">
              전체 아카이브
            </p>
            <h2
              id="home-feed-title"
              className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)]"
            >
              최근 기록
            </h2>
          </div>

          <section className="rounded-[var(--radius-content)] border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] p-4 sm:p-5">
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
                className="grid w-full grid-cols-2 rounded-[var(--radius-selection)] border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] p-1 md:inline-flex md:w-auto"
                role="group"
                aria-label="정렬"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortOrder(option.value)}
                    className={clsx(
                      'rounded-[var(--radius-selection)] px-4 py-2 text-sm font-medium transition-colors',
                      sortOrder === option.value
                        ? 'bg-[var(--color-bg-primary)] text-[var(--color-grey-900)]'
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
        </section>
      </div>
    </Container>
  );
}

export type { HomePageClientProps };
