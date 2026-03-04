import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import EngineeringPage from './EngineeringPage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);

vi.mock('@/shared/layout', () => ({
  Header: () => <div data-testid="mock-header" />,
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('./EngineeringPageClient', () => ({
  default: ({ posts }: { posts: FeedData[] }) => (
    <div data-testid="engineering-client">posts:{posts.length}</div>
  ),
}));

describe('EngineeringPage', () => {
  it('passes only tech posts to client component', () => {
    mockGetSortedFeedData.mockReturnValue([
      {
        slug: 'tech-a',
        title: 'Tech A',
        description: 'A',
        date: '2026-03-01',
        category: 'Tech',
      },
      {
        slug: 'life-a',
        title: 'Life A',
        description: 'B',
        date: '2026-02-28',
        category: 'Life',
      },
      {
        slug: 'series-a',
        title: 'Series A',
        description: 'C',
        date: '2026-02-27',
        category: 'Tech',
        series: { id: 'redis', title: 'Redis', order: 1 },
      },
    ]);

    render(<EngineeringPage />);

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByTestId('engineering-client')).toHaveTextContent('posts:2');
  });
});
