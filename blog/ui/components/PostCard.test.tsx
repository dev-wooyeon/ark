import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import PostCard from './PostCard/PostCard';
import type { FeedData } from '@/blog/model/types';

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

  it('keeps list variant text-only even when image exists', () => {
    const withImage: FeedData = {
      ...basePost,
      image: '/images/test.png',
    };

    render(<PostCard post={withImage} variant="list" />);
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('renders date and title only in archive variant', () => {
    const detailedPost: FeedData = {
      ...basePost,
      readingTime: 12,
      series: {
        id: 'redis',
        title: 'Redis 완전정복',
        order: 1,
      },
      tags: ['redis', 'cache'],
    };

    render(<PostCard post={detailedPost} variant="archive" />);

    const link = screen.getByRole('link', {
      name: /2026\.02\.10 테스트 글/,
    });

    expect(link).toHaveAttribute('href', '/blog/test-post');
    expect(link).toHaveClass(
      'min-h-7',
      'items-baseline',
      'gap-6'
    );
    expect(link).not.toHaveClass('border');
    expect(screen.getByText('2026.02.10')).toHaveAttribute(
      'dateTime',
      '2026-02-10T00:00:00.000Z'
    );
    expect(screen.queryByText('Tech')).not.toBeInTheDocument();
    expect(screen.queryByText('테스트 설명')).not.toBeInTheDocument();
    expect(screen.queryByText('#redis')).not.toBeInTheDocument();
    expect(screen.queryByText('약 12분')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '테스트 글' })).toHaveClass(
      'text-base',
      'font-normal',
      'leading-7'
    );
  });

  it('uses a static content surface for the list variant', () => {
    render(<PostCard post={basePost} variant="list" />);

    const link = screen.getByRole('link', { name: /테스트 글/i });

    expect(link).toHaveClass('rounded-[var(--radius-content)]');
    expect(link).toHaveClass('px-4');
    expect(link).toHaveClass('sm:px-6');
    expect(link).not.toHaveClass('hover:shadow-[var(--shadow-sm)]');
    expect(link).not.toHaveClass('hover:-translate-y-0.5');
  });

  it('uses the content-first type roles in the list variant', () => {
    render(<PostCard post={basePost} variant="list" />);

    expect(screen.getByRole('heading', { name: '테스트 글' })).toHaveClass(
      'text-lg',
      'font-bold',
      'tracking-tight'
    );
    expect(screen.getByText('테스트 설명')).toHaveClass(
      'text-reading',
      'leading-relaxed'
    );
  });

  it('shows category and tags in list variant', () => {
    const detailedPost: FeedData = {
      ...basePost,
      tags: ['redis', 'cache'],
    };

    render(<PostCard post={detailedPost} variant="list" />);

    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('#redis')).toBeInTheDocument();
    expect(screen.getByText('#cache')).toBeInTheDocument();
  });
});
