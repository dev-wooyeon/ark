import Link from 'next/link';
import { clsx } from 'clsx';
import { FeedData } from '@/blog/model/types';
import { CategoryIcon } from '@/ui/icons/AppSectionIcon';

interface PostCardProps {
  post: FeedData;
  variant?: 'archive' | 'default' | 'list';
}

function formatArchiveDate(date: string): string {
  const matchedDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);

  if (!matchedDate) {
    return date;
  }

  return `${matchedDate[1]}.${matchedDate[2]}.${matchedDate[3]}`;
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const readingTimeLabel = post.readingTime ? `약 ${post.readingTime}분` : null;
  const visibleTags = post.tags?.slice(0, 3) ?? [];

  if (variant === 'archive') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={clsx(
          'group flex min-h-11 flex-col items-start gap-1.5 rounded-[var(--radius-action)] py-3 sm:flex-row sm:items-baseline sm:gap-3 sm:py-2',
          'transition-colors duration-[var(--duration-200)] ease-[var(--ease-default)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]'
        )}
      >
        <time
          dateTime={post.date}
          className="shrink-0 text-meta font-medium tabular-nums text-[var(--color-text-tertiary)]"
        >
          {formatArchiveDate(post.date)}
        </time>
        <h3 className="min-w-0 text-lg font-semibold leading-snug tracking-tight text-[var(--color-text-primary)] transition-colors duration-[var(--duration-200)] ease-[var(--ease-default)] group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)] sm:text-base">
          {post.title}
        </h3>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={clsx(
          'group block overflow-hidden rounded-[var(--radius-content)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-5 sm:px-6',
          'transition-colors duration-[var(--duration-200)] ease-[var(--ease-default)]',
          'hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]'
        )}
      >
        <div className="min-w-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-meta text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-selection)] border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <CategoryIcon category={post.category} />
                {post.category}
              </span>
              {post.series ? (
                <span className="inline-flex items-center rounded-[var(--radius-selection)] border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  {post.series.title}
                </span>
              ) : null}
              <span className="h-1 w-1 rounded-full bg-[var(--color-grey-300)]" />
              <time>{formattedDate}</time>
              {readingTimeLabel && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-grey-300)]" />
                  <span>{readingTimeLabel}</span>
                </>
              )}
            </div>
            <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-[var(--color-text-primary)] transition-colors duration-[var(--duration-200)] ease-[var(--ease-default)] group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)]">
              {post.title}
            </h3>
            <p className="mt-2 max-w-3xl text-reading leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">
              {post.description}
            </p>
            {visibleTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[var(--radius-selection)] bg-[var(--color-grey-50)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-tertiary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6',
        'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
        'hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-md)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
        'active:translate-y-0 active:shadow-sm'
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] transition-transform duration-300 ease-[var(--ease-default)] group-hover:translate-x-0.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
          <CategoryIcon category={post.category} />
          {post.category}
        </span>
        <span className="h-1 w-1 rounded-full bg-[var(--color-grey-300)]" />
        <time>{formattedDate}</time>
        {readingTimeLabel && (
          <>
            <span className="h-1 w-1 rounded-full bg-[var(--color-grey-300)]" />
            <span>{readingTimeLabel}</span>
          </>
        )}
      </div>
      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition-[color,transform] duration-300 ease-[var(--ease-default)] group-hover:translate-x-1 group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)]">
        {post.title}
      </h3>
      <p className="mt-3 flex-grow line-clamp-2 text-sm text-[var(--color-text-secondary)] transition-transform duration-300 ease-[var(--ease-default)] group-hover:translate-x-1">
        {post.description}
      </p>
    </Link>
  );
}

export type { PostCardProps };
