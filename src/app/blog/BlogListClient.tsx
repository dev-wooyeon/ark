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
    if (activeCategory === 'All') return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div>
      <div className="mb-8">
        <CategoryFilter
          categories={['All', 'Tech', 'Life']}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <PostList posts={filteredPosts} />
    </div>
  );
}
