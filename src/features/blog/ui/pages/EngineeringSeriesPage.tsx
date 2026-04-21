import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSeriesSummaries } from '@/features/blog/model/series-group';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { Container } from '@/shared/layout';

interface EngineeringSeriesPageProps {
  seriesId: string;
}

function formatPostDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function EngineeringSeriesPage({
  seriesId,
}: EngineeringSeriesPageProps) {
  const techPosts = getSortedFeedData().filter(
    (post) => post.category === 'Tech'
  );
  const seriesSummary = getSeriesSummaries(techPosts).find(
    (summary) => summary.id === seriesId
  );

  if (!seriesSummary) {
    notFound();
  }

  return (
    <main className="py-10">
      <Container size="md">
        <Link
          href="/engineering"
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-toss-blue)] hover:underline"
        >
          <span aria-hidden="true">←</span>
          Engineering으로 돌아가기
        </Link>

        <header className="mb-8 mt-5">
          <span className="inline-flex rounded-full border border-[var(--color-category-series-border)] bg-[var(--color-category-series-bg)] px-2 py-1 text-xs font-medium text-[var(--color-category-series-text)]">
            Series
          </span>
          <h1 className="mt-3 text-3xl font-bold text-[var(--color-grey-900)] md:text-4xl">
            {seriesSummary.title}
          </h1>
          <p className="mt-3 text-sm text-[var(--color-grey-600)]">
            {seriesSummary.postCount}개 글을 순서대로 확인할 수 있어요.
          </p>
        </header>

        <ol className="space-y-3">
          {seriesSummary.posts.map((post) => {
            const order = post.series?.order ?? 0;

            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex min-h-20 items-center justify-between gap-4 rounded-xl border border-[var(--color-grey-100)] bg-[var(--color-bg-primary)] px-4 py-3 transition-colors hover:border-[var(--color-grey-200)] hover:bg-[var(--color-grey-50)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[var(--color-grey-500)]">
                      {order}편 · {formatPostDate(post.date)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-base font-semibold text-[var(--color-grey-900)] group-hover:text-[var(--color-toss-blue)]">
                      {post.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--color-grey-600)]">
                      {post.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-[var(--color-toss-blue)]">
                    글 보기
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </main>
  );
}

export type { EngineeringSeriesPageProps };
