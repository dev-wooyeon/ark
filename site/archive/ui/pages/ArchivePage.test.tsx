import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import ArchivePage from './ArchivePage';

vi.mock('@/blog/services/post-repository', () => ({
  getSortedFeedData: (): FeedData[] => [
    {
      slug: 'latest-post',
      title: '최신 글',
      description: '설명',
      date: '2026-03-20T00:00:00.000Z',
      category: 'Tech',
    },
  ],
}));

vi.mock('@/blog/ui/components', () => ({
  PostList: ({
    posts: renderedPosts,
    layout,
  }: {
    posts: FeedData[];
    layout: string;
  }) => (
    <ol data-layout={layout} data-testid="post-list">
      {renderedPosts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ol>
  ),
}));

describe('ArchivePage', () => {
  it('renders the date-title archive without category controls', () => {
    render(<ArchivePage />);

    expect(screen.getByLabelText('글 아카이브')).toHaveClass('pt-3');
    expect(screen.getByTestId('post-list')).toHaveAttribute(
      'data-layout',
      'archive'
    );
    expect(screen.getByText('최신 글')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /All/ })).not.toBeInTheDocument();
  });
});
