import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import HomePageClient from './HomePageClient';

vi.mock('@/shared/layout', () => ({
  Container: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

vi.mock('@/features/blog/ui/components', () => ({
  CategoryFilter: ({
    categories,
    activeCategory,
  }: {
    categories: string[];
    activeCategory: string;
  }) => (
    <div>
      {categories.map((category) => (
        <span key={category} data-active={category === activeCategory}>
          {category}
        </span>
      ))}
    </div>
  ),
  PostList: ({ posts }: { posts: FeedData[] }) => (
    <div data-testid="post-list">{posts.length}</div>
  ),
}));

const samplePosts: FeedData[] = [
  {
    slug: 'tech-post',
    title: '기술 글',
    description: '설명',
    date: '2026-03-20T00:00:00.000Z',
    category: 'Tech',
    tags: ['tech'],
  },
  {
    slug: 'life-post',
    title: '라이프 글',
    description: '설명',
    date: '2026-03-19T00:00:00.000Z',
    category: 'Life',
    tags: ['life'],
  },
];

describe('HomePageClient', () => {
  it('keeps only archive filters and removes the local search input', () => {
    render(<HomePageClient posts={samplePosts} popularViews={[]} />);

    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '최신순' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '인기순' })).toBeInTheDocument();
  });
});
