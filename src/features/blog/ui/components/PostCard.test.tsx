import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PostCard from './PostCard/PostCard';
import type { FeedData } from '@/domains/post/model/types';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
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
    const { container } = render(<PostCard post={basePost} variant="featured" />);
    const link = container.querySelector('a');

    expect(link).toHaveClass('bg-gradient-to-br');
  });

  it('omits reading time text when not provided', () => {
    render(<PostCard post={basePost} />);
    expect(screen.queryByText('분 읽기')).not.toBeInTheDocument();
  });

  it('shows reading time when provided', () => {
    const withReading: FeedData = {
      ...basePost,
      readingTime: 12,
    };

    render(<PostCard post={withReading} />);
    expect(screen.getByText('12분 읽기')).toBeInTheDocument();
  });
});

