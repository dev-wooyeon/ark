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

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') {
      return posts.filter((post) => post.category !== 'Series' && !post.series);
    }

    if (activeCategory === 'Series') {
      return posts.filter(
        (post) => post.category === 'Series' || !!post.series
      );
    }

    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div>
      <div className="mb-8">
        <CategoryFilter
          categories={['All', 'Tech', 'Series', 'Life']}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <PostList posts={filteredPosts} />
    </div>
  );
}
