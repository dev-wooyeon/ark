'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import { PostList } from '@/features/blog/ui/components';
const ARTICLE_PAGE_SIZE = 5;

interface EngineeringPageClientProps {
  posts: FeedData[];
}

export default function EngineeringPageClient({
  posts,
}: EngineeringPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();

  const articlePosts = useMemo(
    () => posts.filter((post) => post.category === 'Tech' && !post.series),
    [posts]
  );
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
    const startIndex = (currentPage - 1) * ARTICLE_PAGE_SIZE;
    return articlePosts.slice(startIndex, startIndex + ARTICLE_PAGE_SIZE);
  }, [articlePosts, currentPage]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParamString);
    let changed = false;

    if (nextParams.has('type')) {
      nextParams.delete('type');
      changed = true;
    }

    if (nextParams.has('tag')) {
      nextParams.delete('tag');
      changed = true;
    }

    if (currentPage <= 1) {
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
  }, [currentPage, pathname, router, searchParamString]);

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
      <section>
        <header className="mb-5">
          <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
            아티클
          </h2>
          <p className="mt-2 text-sm text-[var(--color-grey-600)]">
            기술 글을 시간순으로 모아뒀어요
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
    </section>
  );
}

export type { EngineeringPageClientProps };
