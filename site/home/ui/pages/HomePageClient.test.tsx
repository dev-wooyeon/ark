import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import HomePageClient from './HomePageClient';

vi.mock('@/ui/layout', () => ({
  Container: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="home-container" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/blog/ui/components', () => ({
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
  PostList: ({ posts, layout }: { posts: FeedData[]; layout?: string }) => (
    <ol data-layout={layout} data-testid="post-list">
      {posts.map((post) => (
        <li key={post.slug} data-testid="post-list-item">
          {post.slug}
        </li>
      ))}
    </ol>
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
  it('starts with archive filters without a feed heading or local search', () => {
    render(<HomePageClient posts={samplePosts} />);

    expect(screen.queryByText('전체 아카이브')).not.toBeInTheDocument();
    expect(screen.queryByText('최근 기록')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: '시스템을 운영하며 내린 기술적 판단과 실패를 기록합니다',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '먼저 읽을 글' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByTestId('home-container')).toHaveClass('md:pt-4');
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '최신순' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '인기순' })
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId('post-list-item')[0]).toHaveTextContent(
      'tech-post'
    );
    expect(screen.getByTestId('post-list')).toHaveAttribute(
      'data-layout',
      'archive'
    );
  });
});
