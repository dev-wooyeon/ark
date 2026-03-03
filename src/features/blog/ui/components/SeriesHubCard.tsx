import type { SeriesSummary } from '@/features/blog/model/series-group';
import { formatSeriesDate } from '@/features/blog/model/series-group';
import SeriesTrackedLink from './SeriesTrackedLink';

interface SeriesHubCardProps {
  summary: SeriesSummary;
  seriesIndex: number;
}

export default function SeriesHubCard({ summary, seriesIndex }: SeriesHubCardProps) {
  const metaText = `총 ${summary.postCount}편 · 총 ${summary.totalReadingMinutes}분 · 최근 업데이트 ${formatSeriesDate(summary.latestDate)}`;
  const firstPostOrder = summary.posts[0]?.series?.order;

  return (
    <section className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full border border-[var(--color-category-series-border)] bg-[var(--color-category-series-bg)] px-2 py-1 text-xs font-medium text-[var(--color-category-series-text)]">
            Series
          </span>
          <h2 className="mt-2 text-xl font-semibold text-[var(--color-text-primary)]">
            {summary.title}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">{metaText}</p>
        </div>

        {summary.firstPostSlug && (
          <SeriesTrackedLink
            href={`/blog/${summary.firstPostSlug}`}
            target="series_hub_start"
            seriesId={summary.id}
            seriesTitle={summary.title}
            postSlug={summary.firstPostSlug}
            episodeOrder={firstPostOrder}
            seriesIndex={seriesIndex}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
          >
            첫 글부터 읽기
            <span aria-hidden="true">→</span>
          </SeriesTrackedLink>
        )}
      </div>

      <ol className="mt-5 space-y-2">
        {summary.posts.map((post) => {
          const order = post.series?.order ?? 0;

          return (
            <li key={post.slug}>
              <SeriesTrackedLink
                href={`/blog/${post.slug}`}
                target="series_hub_episode"
                seriesId={summary.id}
                seriesTitle={summary.title}
                postSlug={post.slug}
                episodeOrder={order}
                seriesIndex={seriesIndex}
                className="flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-grey-50)] hover:text-[var(--color-text-primary)]"
              >
                <span className="w-6 text-[var(--color-text-tertiary)]">{order}.</span>
                <span className="flex-1 truncate">{post.title}</span>
              </SeriesTrackedLink>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export type { SeriesHubCardProps };
