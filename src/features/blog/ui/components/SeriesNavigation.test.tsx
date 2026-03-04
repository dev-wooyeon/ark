import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeriesNavigation } from './SeriesNavigation';

const posts = [
  {
    slug: 'post-1',
    title: '기초편',
    series: { id: 'redis', order: 1 },
    category: 'Tech',
    date: '2026-01-01',
    description: '',
  },
  {
    slug: 'post-2',
    title: '심화편',
    series: { id: 'redis', order: 2 },
    category: 'Tech',
    date: '2026-01-02',
    description: '',
  },
];

describe('SeriesNavigation', () => {
  it('shows current item and prev/next links', () => {
    render(
      <SeriesNavigation
        currentSlug="post-2"
        currentOrder={2}
        seriesTitle="Redis Deep Dive"
        seriesPosts={posts}
      />
    );

    expect(screen.getByText('시리즈')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links.every((link) => link.getAttribute('href'))).toBeTruthy();
    expect(links.every((link) => link.getAttribute('href') === '/blog/post-1')).toBe(
      true
    );
  });

  it('toggles content visibility', () => {
    render(
      <SeriesNavigation
        currentSlug="post-2"
        currentOrder={2}
        seriesTitle="Redis Deep Dive"
        seriesPosts={posts}
      />
    );

    const toggle = screen.getByRole('button');
    fireEvent.click(toggle);

    expect(screen.queryByRole('link', { name: /이전 글/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
