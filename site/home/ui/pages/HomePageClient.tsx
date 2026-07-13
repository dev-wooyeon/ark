'use client';

import { useMemo, useState } from 'react';
import type { FeedData } from '@/blog/model/types';
import { CategoryFilter, PostList, type Category } from '@/blog/ui/components';
import {
  buildHomeCategoryCounts,
  filterHomePosts,
} from '@/site/home/model/home-feed';
import { Container } from '@/ui/layout';

interface HomePageClientProps {
  posts: FeedData[];
}

const FEED_CATEGORIES: Category[] = ['All', 'Tech', 'Life'];

export default function HomePageClient({ posts }: HomePageClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categoryCounts = useMemo(() => buildHomeCategoryCounts(posts), [posts]);
  const filteredPosts = useMemo(
    () => filterHomePosts(posts, activeCategory),
    [activeCategory, posts]
  );

  return (
    <Container size="md" className="py-8 md:py-10">
      <section aria-labelledby="home-feed-title" className="space-y-5">
        <div>
          <p className="text-meta font-semibold text-[var(--color-text-tertiary)]">
            전체 아카이브
          </p>
          <h1
            id="home-feed-title"
            className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)]"
          >
            최근 기록
          </h1>
        </div>

        <section className="rounded-[var(--radius-content)] border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] p-4 sm:p-5">
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
        </section>

        <PostList posts={filteredPosts} layout="list" />
      </section>
    </Container>
  );
}

export type { HomePageClientProps };
