'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import { EmptyState } from '@/shared/ui';
import { PostList, SeriesHubList } from '@/features/blog/ui/components';
import { getSeriesSummaries } from '@/features/blog/model/series-group';

type EngineeringTypeFilter = 'all' | 'article' | 'series';

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

  const { articlePosts, seriesSummaries, allTags } = useMemo(() => {
    const techPosts = posts.filter((post) => post.category === 'Tech');
    const articleEntries = techPosts.filter((post) => !post.series);
    const summaries = getSeriesSummaries(techPosts);
    const tagSet = new Set<string>();

    techPosts.forEach((post) => {
      (post.tags ?? []).forEach((tag) => {
        if (tag.trim().length > 0) {
          tagSet.add(tag);
        }
      });
    });

    return {
      articlePosts: articleEntries,
      seriesSummaries: summaries,
      allTags: Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'ko')),
    };
  }, [posts]);

  const rawType = searchParams.get('type');
  const typeFilter = normalizeTypeFilter(rawType);
  const rawTag = (searchParams.get('tag') ?? '').trim();
  const selectedTag = allTags.includes(rawTag) ? rawTag : '';

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

    if (!selectedTag) {
      if (nextParams.has('tag')) {
        nextParams.delete('tag');
        changed = true;
      }
    } else if (nextParams.get('tag') !== selectedTag) {
      nextParams.set('tag', selectedTag);
      changed = true;
    }

    if (!changed) {
      return;
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, rawTag, router, searchParamString, selectedTag, typeFilter]);

  const updateFilter = (
    nextType: EngineeringTypeFilter,
    nextTag: string
  ) => {
    const nextParams = new URLSearchParams(searchParamString);

    if (nextType === 'all') {
      nextParams.delete('type');
    } else {
      nextParams.set('type', nextType);
    }

    if (nextTag) {
      nextParams.set('tag', nextTag);
    } else {
      nextParams.delete('tag');
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filteredArticlePosts = useMemo(() => {
    if (!selectedTag) {
      return articlePosts;
    }

    return articlePosts.filter((post) => (post.tags ?? []).includes(selectedTag));
  }, [articlePosts, selectedTag]);

  const filteredSeriesSummaries = useMemo(() => {
    if (!selectedTag) {
      return seriesSummaries;
    }

    return seriesSummaries.filter((summary) =>
      summary.posts.some((post) => (post.tags ?? []).includes(selectedTag))
    );
  }, [selectedTag, seriesSummaries]);

  const showArticles = typeFilter !== 'series';
  const showSeries = typeFilter !== 'article';

  return (
    <section>
      <div className="sticky top-0 md:top-16 z-20 mb-8 border-b border-[var(--color-grey-100)] bg-[var(--color-bg-primary)]/90 py-3 backdrop-blur-md">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => updateFilter(filter.value, selectedTag)}
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateFilter(typeFilter, '')}
              aria-pressed={selectedTag === ''}
              className={clsx(
                'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
                selectedTag === ''
                  ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]'
              )}
            >
              전체 태그
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => updateFilter(typeFilter, tag)}
                aria-pressed={selectedTag === tag}
                className={clsx(
                  'inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
                  selectedTag === tag
                    ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]'
                )}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-14">
        {showArticles && (
          <section>
            <header className="mb-5">
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
                최신 아티클
              </h2>
              <p className="mt-2 text-sm text-[var(--color-grey-600)]">
                Engineering 주제의 최신 글을 시간순으로 모아봤어요
              </p>
            </header>
            <PostList posts={filteredArticlePosts} layout="list" />
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
            {filteredSeriesSummaries.length === 0 ? (
              <EmptyState
                icon={<span className="tossface">📚</span>}
                title="조건에 맞는 시리즈가 없어요"
                description="다른 태그를 선택하면 더 많은 시리즈를 볼 수 있어요"
                size="sm"
              />
            ) : (
              <SeriesHubList seriesSummaries={filteredSeriesSummaries} />
            )}
          </section>
        )}
      </div>
    </section>
  );
}

export type { EngineeringPageClientProps, EngineeringTypeFilter };
