import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import HomeHero from './HomeHero';

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

const latestPost: FeedData = {
  slug: 'latest-note',
  title: '가장 최근의 기록',
  description: '설명',
  date: '2026-07-15T00:00:00.000Z',
  category: 'Tech',
};

describe('HomeHero', () => {
  it('links the featured latest note and utility destinations', () => {
    render(<HomeHero latestPost={latestPost} postCount={12} />);

    expect(
      screen.getByRole('link', { name: /가장 최근의 기록/i })
    ).toHaveAttribute('href', '/blog/latest-note');
    expect(screen.getByRole('link', { name: 'Archive (12)' })).toHaveAttribute(
      'href',
      '/blog'
    );
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      '/resume'
    );
    expect(screen.getByRole('link', { name: 'RSS' })).toHaveAttribute(
      'href',
      '/rss.xml'
    );
  });

  it('uses a calm empty-state message when there is no post yet', () => {
    render(<HomeHero postCount={0} />);

    expect(screen.getByText('새 글을 준비하고 있어요.')).toBeInTheDocument();
  });
});
