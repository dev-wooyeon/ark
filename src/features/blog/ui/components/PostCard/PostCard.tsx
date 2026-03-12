import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import { FeedData } from '@/domains/post/model/types';

interface PostCardProps {
  post: FeedData;
  variant?: 'default' | 'featured' | 'list';
}

function CategoryIcon({ category }: { category: string }) {
  switch (category) {
    case 'Tech':
      return (
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 20h8" />
          <path d="M10 16v4" />
          <path d="M14 16v4" />
        </svg>
      );
    case 'Life':
      return (
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" />
          <path d="M8 7h7" />
          <path d="M8 11h7" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m20 12-8 8-8-8 8-8 8 8z" />
        </svg>
      );
  }
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const readingTimeLabel = post.readingTime ? `약 ${post.readingTime}분` : null;

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
          'group block rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-4',
          'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
          'hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-grey-50)] px-2 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                <CategoryIcon category={post.category} />
                {post.series ? 'Series' : post.category}
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
            <h3 className="mt-2 text-base font-semibold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)]">
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">
              {post.description}
            </p>
          </div>
          {post.image ? (
            <div className="hidden h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] sm:block">
              <Image
                src={post.image}
                alt=""
                width={256}
                height={160}
                sizes="128px"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          ) : null}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group flex h-full cursor-pointer flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6',
        'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
        'hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-md)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]',
        'active:translate-y-0 active:shadow-sm'
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
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
      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-toss-blue)] group-focus-visible:text-[var(--color-toss-blue)]">
        {post.title}
      </h3>
      <p className="mt-3 flex-grow line-clamp-2 text-sm text-[var(--color-text-secondary)]">
        {post.description}
      </p>
    </Link>
  );
}

export type { PostCardProps };
