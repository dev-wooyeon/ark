import { fireEvent, render, screen, within } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedData } from '@/domains/post/model/types';
import type { SeriesSummary } from '@/features/blog/model/series-group';
import HeroSection from './HeroSection';

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

vi.mock('@/shared/analytics/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

function createArticle(index: number): FeedData {
  return {
    slug: `article-${index}`,
    title: `아티클 ${index}`,
    description: `본문 ${index}`,
    date: `2026-03-${String(index).padStart(2, '0')}`,
    category: index % 2 === 0 ? 'Tech' : 'Life',
  };
}

const articlePosts: FeedData[] = Array.from({ length: 6 }, (_, idx) =>
  createArticle(idx + 1)
);

const seriesPost: FeedData = {
  slug: 'series-episode-1',
  title: '시리즈 1화',
  description: '시리즈 설명',
  date: '2026-03-01',
  category: 'Tech',
  series: {
    id: 'redis-deep-dive',
    title: 'Redis 완전정복',
    order: 1,
  },
};

const seriesSummaries: SeriesSummary[] = [
  {
    id: 'redis-deep-dive',
    title: 'Redis 완전정복',
    posts: [seriesPost],
    latestDate: '2026-03-01',
    firstPostSlug: 'series-episode-1',
    postCount: 1,
    totalReadingMinutes: 7,
  },
];

const popularPosts = [
  { post: articlePosts[0], viewCount: 1200 },
  { post: articlePosts[1], viewCount: 950 },
];

describe('HeroSection', () => {
  it('shows five non-series articles per page', () => {
    render(
      <HeroSection
        allArticles={[...articlePosts, seriesPost]}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    const articleSection = document.getElementById('home-article-list');
    expect(articleSection).toBeTruthy();

    const articleScope = within(articleSection as HTMLElement);
    expect(articleScope.getByText('아티클 1')).toBeInTheDocument();
    expect(articleScope.getByText('아티클 5')).toBeInTheDocument();
    expect(articleScope.queryByText('2026년 3월 1일')).not.toBeInTheDocument();
    expect(articleScope.queryByText('아티클 6')).not.toBeInTheDocument();
    expect(articleScope.queryByText('시리즈 1화')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(articleScope.getByText('아티클 6')).toBeInTheDocument();
  });

  it('renders popular posts with rank emoji and hides date metadata', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    const popularHeading = screen.getByRole('heading', { name: '인기 글' });
    const popularSection = popularHeading.closest('section');

    expect(popularHeading).toBeInTheDocument();
    expect(popularSection).toBeTruthy();

    const popularScope = within(popularSection as HTMLElement);
    expect(popularScope.getByText('아티클 1')).toBeInTheDocument();
    expect(popularScope.getByText('🥇')).toBeInTheDocument();
    expect(popularScope.queryByText('Life')).not.toBeInTheDocument();
    expect(popularScope.queryByText('Tech')).not.toBeInTheDocument();
    expect(popularScope.queryByText('2026년 3월 1일')).not.toBeInTheDocument();
    expect(popularScope.queryByText('1,200')).not.toBeInTheDocument();
  });

  it('renders hero CTA labels with matched Korean length', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    expect(screen.getByRole('link', { name: '아티클 보기' })).toHaveAttribute(
      'href',
      '/engineering'
    );
    expect(screen.getByText('1개 글')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '이력서 보기' })).toHaveAttribute(
      'href',
      '/resume'
    );
    expect(
      screen.queryByRole('link', { name: 'Engineering' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Resume' })
    ).not.toBeInTheDocument();
  });

  it('separates CTA emoji from label text and keeps sans font on labels', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    const engineeringCta = screen.getByRole('link', { name: '아티클 보기' });
    const resumeCta = screen.getByRole('link', { name: '이력서 보기' });

    expect(within(engineeringCta).getByText('📝')).toHaveClass('tossface');
    expect(within(resumeCta).getByText('👨‍💻')).toHaveClass('tossface');
    expect(within(engineeringCta).getByText('아티클 보기')).toHaveStyle({
      fontFamily: 'var(--font-sans)',
    });
    expect(within(resumeCta).getByText('이력서 보기')).toHaveStyle({
      fontFamily: 'var(--font-sans)',
    });
  });

  it('renders scroll indicator with tiny label and wheel drag motion', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    const scrollButton = screen.getByRole('button', {
      name: '전체 아티클 보기',
    });
    const scrollLabel = within(scrollButton).getByText('Scroll down');

    expect(scrollLabel).toHaveStyle({ fontSize: '10px' });
    expect(scrollButton.querySelector('.animate-bounce')).toBeNull();
    expect(
      scrollButton.querySelector('.animate-scroll-wheel-drag')
    ).toBeInTheDocument();
  });

  it('shows fallback text when popular list is empty', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={[]}
      />
    );

    expect(screen.getByText('인기 글을 집계하고 있어요.')).toBeInTheDocument();
  });

  it('keeps mobile section order as article -> popular -> series', () => {
    render(
      <HeroSection
        allArticles={articlePosts}
        seriesSummaries={seriesSummaries}
        popularPosts={popularPosts}
      />
    );

    const articleHeading = screen.getByRole('heading', { name: '전체 아티클' });
    const popularHeading = screen.getByRole('heading', { name: '인기 글' });
    const seriesHeading = screen.getByRole('heading', {
      name: '아티클 시리즈',
    });

    expect(
      articleHeading.compareDocumentPosition(popularHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      popularHeading.compareDocumentPosition(seriesHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
