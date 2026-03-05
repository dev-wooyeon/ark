import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import LifePage from './LifePage';

const mockGetSortedFeedData = vi.fn<() => FeedData[]>(() => []);

vi.mock('@/shared/layout', () => ({
  Header: () => <div data-testid="mock-header" />,
  Container: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/features/blog/services/post-repository', () => ({
  getSortedFeedData: () => mockGetSortedFeedData(),
}));

vi.mock('@/features/blog/ui/components', () => ({
  PostList: ({ posts }: { posts: FeedData[] }) => (
    <div data-testid="life-post-list">posts:{posts.length}</div>
  ),
}));

describe('LifePage', () => {
  it('passes only life posts to list component', () => {
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
    ]);

    render(<LifePage />);

    expect(screen.getByText('Life')).toBeInTheDocument();
    expect(screen.getByTestId('life-post-list')).toHaveTextContent('posts:1');
  });
});
