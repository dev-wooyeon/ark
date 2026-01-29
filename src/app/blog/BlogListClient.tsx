'use client';

import { useState, useMemo } from 'react';
import { CategoryFilter, PostList } from '@/components/blog';
import type { Post, Category } from '@/components/blog';

interface BlogListClientProps {
  posts: Post[];
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
          categories={['All', 'Dev', 'Life']}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <PostList posts={filteredPosts} />
    </div>
  );
}
