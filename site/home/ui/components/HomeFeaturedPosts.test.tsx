import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import HomeFeaturedPosts from './HomeFeaturedPosts';

const featuredPost: FeedData = {
  slug: 'featured-post',
  title: '운영에서 배운 기준',
  description: '설명',
  date: '2026-07-13',
  category: 'Tech',
  contentType: 'retrospective',
  visibility: 'public',
};

describe('HomeFeaturedPosts', () => {
  it('renders nothing without curated posts', () => {
    const { container } = render(<HomeFeaturedPosts posts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('links curated posts from the first-visit section', () => {
    render(<HomeFeaturedPosts posts={[featuredPost]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: '먼저 읽을 글' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /운영에서 배운 기준/ })
    ).toHaveAttribute('href', '/blog/featured-post');
  });
});
