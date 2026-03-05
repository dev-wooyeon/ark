'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import { EmptyState } from '@/shared/ui';
import { PostList, SeriesHubList } from '@/features/blog/ui/components';
import { getSeriesSummaries } from '@/features/blog/model/series-group';

type EngineeringTypeFilter = 'all' | 'article' | 'series';
const ARTICLE_PAGE_SIZE = 5;

interface EngineeringPageClientProps {
  posts: FeedData[];
}

const TYPE_FILTERS: Array<{ value: EngineeringTypeFilter; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'article', label: '아티클' },
  { value: 'series', label: '시리즈' },
];

function normalizeTypeFilter(value: string | null): EngineeringTypeFilter {
  if (value === 'article' || value === 'series' || value === 'all') {
    return value;
  }

  return 'all';
}

export default function EngineeringPageClient({
  posts,
}: EngineeringPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();

  const { articlePosts, seriesSummaries } = useMemo(() => {
    const techPosts = posts.filter((post) => post.category === 'Tech');

    return {
      articlePosts: techPosts.filter((post) => !post.series),
      seriesSummaries: getSeriesSummaries(techPosts),
    };
  }, [posts]);

  const rawType = searchParams.get('type');
  const typeFilter = normalizeTypeFilter(rawType);
  const showArticles = typeFilter !== 'series';
  const showSeries = typeFilter !== 'article';
  const totalArticlePages = Math.max(
    1,
    Math.ceil(articlePosts.length / ARTICLE_PAGE_SIZE)
  );
  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const normalizedPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const currentPage = Math.min(normalizedPage, totalArticlePages);
  const pageNumbers = useMemo(
    () => Array.from({ length: totalArticlePages }, (_, idx) => idx + 1),
    [totalArticlePages]
  );
  const pagedArticlePosts = useMemo(() => {
    if (!showArticles) {
      return [];
    }
    const startIndex = (currentPage - 1) * ARTICLE_PAGE_SIZE;
    return articlePosts.slice(startIndex, startIndex + ARTICLE_PAGE_SIZE);
  }, [articlePosts, currentPage, showArticles]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParamString);
    let changed = false;

    if (typeFilter === 'all') {
      if (nextParams.has('type')) {
        nextParams.delete('type');
        changed = true;
      }
    } else if (nextParams.get('type') !== typeFilter) {
      nextParams.set('type', typeFilter);
      changed = true;
    }

    if (nextParams.has('tag')) {
      nextParams.delete('tag');
      changed = true;
    }

    if (!showArticles) {
      if (nextParams.has('page')) {
        nextParams.delete('page');
        changed = true;
      }
    } else if (currentPage <= 1) {
      if (nextParams.has('page')) {
        nextParams.delete('page');
        changed = true;
      }
    } else if (nextParams.get('page') !== String(currentPage)) {
      nextParams.set('page', String(currentPage));
      changed = true;
    }

    if (!changed) {
      return;
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [currentPage, pathname, router, searchParamString, showArticles, typeFilter]);

  const updateTypeFilter = (nextType: EngineeringTypeFilter) => {
    const nextParams = new URLSearchParams(searchParamString);

    if (nextType === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', nextType);
    }

    if (nextParams.has('tag')) {
      nextParams.delete('tag');
    }

    if (nextType === 'series') {
      nextParams.delete('page');
    } else if (currentPage > 1) {
      nextParams.set('page', String(currentPage));
    } else {
      nextParams.delete('page');
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const updatePage = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(nextPage, 1), totalArticlePages);
    const nextParams = new URLSearchParams(searchParamString);

    if (clampedPage <= 1) {
      nextParams.delete('page');
    } else {
      nextParams.set('page', String(clampedPage));
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section>
      <div className="sticky top-0 z-20 mb-8 border-b border-[var(--color-grey-100)] bg-[var(--color-bg-primary)]/90 py-3 backdrop-blur-md md:top-16">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => updateTypeFilter(filter.value)}
              aria-pressed={typeFilter === filter.value}
              className={clsx(
                'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
                typeFilter === filter.value
                  ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]'
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-14">
        {showArticles && (
          <section>
            <header className="mb-5">
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
                아티클
              </h2>
              <p className="mt-2 text-sm text-[var(--color-grey-600)]">
                Engineering 주제 글을 시간순으로 모아봤어요
              </p>
            </header>
            <PostList posts={pagedArticlePosts} layout="list" />
            {totalArticlePages > 1 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => updatePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="이전 페이지"
                  className="tossface rounded border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-[var(--color-grey-700)] transition-colors hover:bg-[var(--color-grey-50)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &lt;
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => updatePage(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={clsx(
                      'rounded border px-3 py-1.5 transition-colors',
                      page === currentPage
                        ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white'
                        : 'border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] text-[var(--color-grey-700)] hover:bg-[var(--color-grey-50)]'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updatePage(currentPage + 1)}
                  disabled={currentPage === totalArticlePages}
                  aria-label="다음 페이지"
                  className="tossface rounded border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-[var(--color-grey-700)] transition-colors hover:bg-[var(--color-grey-50)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  &gt;
                </button>
              </div>
            ) : null}
          </section>
        )}

        {showSeries && (
          <section>
            <header className="mb-5">
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
                시리즈
              </h2>
              <p className="mt-2 text-sm text-[var(--color-grey-600)]">
                하나의 주제를 깊게 다루는 연재 글을 모아봤어요
              </p>
            </header>
            {seriesSummaries.length === 0 ? (
              <EmptyState
                icon={<span className="tossface">📚</span>}
                title="시리즈를 준비하고 있어요"
                description="다른 필터를 선택하면 아티클을 더 볼 수 있어요"
                size="sm"
              />
            ) : (
              <SeriesHubList seriesSummaries={seriesSummaries} />
            )}
          </section>
        )}
      </div>
    </section>
  );
}

export type { EngineeringPageClientProps, EngineeringTypeFilter };
