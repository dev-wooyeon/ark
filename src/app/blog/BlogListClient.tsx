'use client';

import { useState, useMemo } from 'react';
import { CategoryFilter, PostList } from '@/components/blog';
import type { Category } from '@/components/blog';
import type { FeedData } from '@/types';

interface BlogListClientProps {
  posts: FeedData[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const blogPosts = useMemo(
    () => posts.filter((post) => post.category !== 'Series' && !post.series),
    [posts]
  );

  const postsByCategory = useMemo<Record<Category, FeedData[]>>(
    () => ({
      All: blogPosts,
      Tech: blogPosts.filter((post) => post.category === 'Tech'),
      Life: blogPosts.filter((post) => post.category === 'Life'),
    }),
    [blogPosts]
  );

  const filteredPosts = postsByCategory[activeCategory];

  const categoryCounts = useMemo(
    () => ({
      All: postsByCategory.All.length,
      Tech: postsByCategory.Tech.length,
      Life: postsByCategory.Life.length,
    }),
    [postsByCategory]
  );

  return (
    <div>
      <div className="sticky top-0 md:top-16 z-20 mb-8 border-b border-[var(--color-grey-100)] bg-[var(--color-bg-primary)]/90 py-3 backdrop-blur-md">
        <CategoryFilter
          categories={['All', 'Tech', 'Life']}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
        />
      </div>
      <PostList posts={filteredPosts} />
    </div>
  );
}
