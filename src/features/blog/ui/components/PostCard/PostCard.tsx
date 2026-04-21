import Link from 'next/link';
import { clsx } from 'clsx';
import { FeedData } from '@/domains/post/model/types';
import { CategoryIcon } from '@/shared/ui/icons/AppSectionIcon';

interface PostCardProps {
  post: FeedData;
  variant?: 'default' | 'featured' | 'list';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const readingTimeLabel = post.readingTime ? `약 ${post.readingTime}분` : null;
  const visibleTags = post.tags?.slice(0, 3) ?? [];

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={clsx(
          'group block p-8 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--color-toss-blue)] to-[var(--color-toss-blue-dark)]',
          'text-white transition-all duration-[var(--duration-300)]',
          'hover:shadow-[var(--shadow-xl)] hover:-translate-y-1'
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-sm font-medium opacity-85">
          <CategoryIcon category={post.category} />
          {post.category}
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">
          {post.title}
        </h2>
        <p className="mt-4 text-base opacity-90 line-clamp-2">
          {post.description}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm opacity-80">
          <time>{formattedDate}</time>
          {readingTimeLabel && <span>{readingTimeLabel}</span>}
        </div>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className={clsx(
          'group block overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-5 py-5 sm:px-6',
          'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
          'hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)] hover:shadow-[var(--shadow-sm)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]'
        )}
      >
        <div className="min-w-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-tertiary)] transition-transform duration-300 ease-[var(--ease-default)] group-hover:translate-x-0.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <CategoryIcon category={post.category} />
                {post.category}
              </span>
              {post.series ? (
                <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
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
            <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition-[color,transform] duration-300 ease-[var(--ease-default)] group-hover:translate-x-1 group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)]">
              {post.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-secondary)] line-clamp-2 transition-transform duration-300 ease-[var(--ease-default)] group-hover:translate-x-1">
              {post.description}
            </p>
            {visibleTags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2 transition-transform duration-300 ease-[var(--ease-default)] group-hover:translate-x-1">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--color-grey-50)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-tertiary)]"
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
