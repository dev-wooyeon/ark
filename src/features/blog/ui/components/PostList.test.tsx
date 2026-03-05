import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PostList from './PostList/PostList';
import type { FeedData } from '@/domains/post/model/types';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const samplePosts: FeedData[] = [
  {
    slug: 'one',
    title: '첫 번째 글',
    description: 'A',
    date: '2026-02-01T00:00:00.000Z',
    category: 'Tech',
    tags: ['t1'],
  },
  {
    slug: 'two',
    title: '두 번째 글',
    description: 'B',
    date: '2026-02-02T00:00:00.000Z',
    category: 'Life',
    tags: ['t2'],
  },
];

describe('PostList', () => {
  it('shows empty state when no posts exist', () => {
    render(<PostList posts={[]} />);

    expect(screen.getByRole('status')).toHaveTextContent('아직 작성된 글이 없어요');
  });

  it('renders a list of posts', () => {
    render(<PostList posts={samplePosts} />);
    expect(screen.getByText('첫 번째 글')).toBeInTheDocument();
    expect(screen.getByText('두 번째 글')).toBeInTheDocument();
  });

  it('passes PostCard links for each post', () => {
    render(<PostList posts={samplePosts} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/blog/one');
    expect(links[1]).toHaveAttribute('href', '/blog/two');
  });

  it('renders list layout when requested', () => {
    render(<PostList posts={samplePosts} layout="list" />);
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/blog/one');
    expect(screen.getByText('첫 번째 글')).toBeInTheDocument();
  });
});
