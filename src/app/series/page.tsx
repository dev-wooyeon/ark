import Link from 'next/link';
import { Metadata } from 'next';
import { getSortedFeedData } from '@/lib/mdx-feeds';
import { Header, Container } from '@/components/layout';
import type { FeedData } from '@/types';

interface SeriesGroup {
  id: string;
  title: string;
  posts: FeedData[];
  latestDate: string;
}

export const metadata: Metadata = {
  title: 'Series',
  description: '연속된 학습과 구현 기록을 시리즈 단위로 모아봅니다',
};

function getSeriesGroups(posts: FeedData[]): SeriesGroup[] {
  const groups = new Map<string, { title: string; posts: FeedData[] }>();

  posts.forEach((post) => {
    if (!post.series) return;

    const existing = groups.get(post.series.id);
    if (existing) {
      existing.posts.push(post);
      return;
    }

    groups.set(post.series.id, {
      title: post.series.title,
      posts: [post],
    });
  });

  return Array.from(groups.entries())
    .map(([id, value]) => {
      const sortedPosts = [...value.posts].sort(
        (a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0)
      );

      const latestDate = sortedPosts.reduce(
        (latest, post) => (post.date > latest ? post.date : latest),
        sortedPosts[0]?.date ?? ''
      );

      return {
        id,
        title: value.title,
        posts: sortedPosts,
        latestDate,
      };
    })
    .sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function SeriesPage() {
  const allPosts = getSortedFeedData();
  const seriesGroups = getSeriesGroups(allPosts);

  return (
    <>
      <Header />

      <main className="py-16">
        <Container size="md">
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
              Series
            </h1>
            <p className="mt-4 text-lg text-[var(--color-grey-600)]">
              하나의 주제를 깊게 다룬 연재 글을 모아봤습니다
            </p>
          </header>

          {seriesGroups.length === 0 ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-8 text-center text-[var(--color-text-secondary)]">
              등록된 시리즈가 아직 없습니다.
            </div>
          ) : (
            <div className="space-y-6">
              {seriesGroups.map((series) => (
                <section
                  key={series.id}
                  className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                        Series
                      </span>
                      <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
                        {series.title}
                      </h2>
                      <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
                        총 {series.posts.length}편 · 최근 업데이트{' '}
                        {formatDate(series.latestDate)}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${series.posts[0]?.slug ?? ''}`}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
                    >
                      첫 글로 시작
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>

                  <ol className="mt-5 space-y-2">
                    {series.posts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-grey-50)] hover:text-[var(--color-text-primary)]"
                        >
                          <span className="w-6 text-[var(--color-text-tertiary)]">
                            {post.series?.order}.
                          </span>
                          <span className="flex-1 truncate">{post.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
