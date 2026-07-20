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
    <Container size="md" className="py-6 sm:py-8 md:pt-4 md:pb-10">
      <section aria-label="글 아카이브" className="space-y-6 sm:space-y-5">
        <CategoryFilter
          categories={FEED_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
          variant="links"
        />

        <PostList posts={filteredPosts} layout="archive" />
      </section>
    </Container>
  );
}

export type { HomePageClientProps };
