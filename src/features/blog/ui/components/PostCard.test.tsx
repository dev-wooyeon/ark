import { render, screen } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import PostCard from './PostCard/PostCard';
import type { FeedData } from '@/domains/post/model/types';

vi.mock('next/image', () => ({
  default: ({
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
  }) => createElement('img', { ...props, alt: alt ?? '' }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const basePost: FeedData = {
  slug: 'test-post',
  title: '테스트 글',
  description: '테스트 설명',
  date: '2026-02-10T00:00:00.000Z',
  category: 'Tech',
  tags: ['tech'],
};

describe('PostCard', () => {
  it('renders default variant with title and category', () => {
    render(<PostCard post={basePost} />);

    expect(screen.getByText('테스트 글')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /테스트 글/i })).toHaveAttribute(
      'href',
      '/blog/test-post'
    );
  });

  it('renders featured variant styles', () => {
    const { container } = render(
      <PostCard post={basePost} variant="featured" />
    );
    const link = container.querySelector('a');

    expect(link).toHaveClass('bg-gradient-to-br');
  });

  it('omits reading time text when not provided', () => {
    render(<PostCard post={basePost} />);
    expect(screen.queryByText(/약 \d+분/)).not.toBeInTheDocument();
  });

  it('shows reading time when provided', () => {
    const withReading: FeedData = {
      ...basePost,
      readingTime: 12,
    };

    render(<PostCard post={withReading} />);
    expect(screen.getByText('약 12분')).toBeInTheDocument();
  });

  it('renders thumbnail in list variant when image exists', () => {
    const withImage: FeedData = {
      ...basePost,
      image: '/images/test.png',
    };

    render(<PostCard post={withImage} variant="list" />);
    expect(screen.getByRole('presentation')).toHaveAttribute(
      'src',
      '/images/test.png'
    );
  });

  it('shows category, series title, and tags in list variant', () => {
    const detailedPost: FeedData = {
      ...basePost,
      tags: ['redis', 'cache'],
      series: {
        id: 'redis',
        title: 'Redis 완전정복',
        order: 1,
      },
    };

    render(<PostCard post={detailedPost} variant="list" />);

    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Redis 완전정복')).toBeInTheDocument();
    expect(screen.getByText('#redis')).toBeInTheDocument();
    expect(screen.getByText('#cache')).toBeInTheDocument();
  });
});
