import Link from 'next/link';
import { clsx } from 'clsx';
import { FeedData } from '@/types';

interface PostCardProps {
  post: FeedData;
  variant?: 'default' | 'featured';
}

function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case 'Tech':
      return 'text-[var(--color-category-tech-text)] bg-[var(--color-category-tech-bg)] border-[var(--color-category-tech-border)]';
    case 'Series':
      return 'text-[var(--color-category-series-text)] bg-[var(--color-category-series-bg)] border-[var(--color-category-series-border)]';
    case 'Life':
      return 'text-[var(--color-category-life-text)] bg-[var(--color-category-life-bg)] border-[var(--color-category-life-border)]';
    default:
      return 'text-[var(--color-category-tech-text)] bg-[var(--color-category-tech-bg)] border-[var(--color-category-tech-border)]';
  }
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const categoryBadgeClass = getCategoryBadgeClass(post.category);

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
        <span className="text-sm font-medium opacity-80">{post.category}</span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight">
          {post.title}
        </h2>
        <p className="mt-4 text-base opacity-90 line-clamp-2">
          {post.description}
        </p>
        <div className="mt-6 flex items-center gap-4 text-sm opacity-80">
          <time>{formattedDate}</time>
          {post.readingTime && <span>{post.readingTime}분 읽기</span>}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={clsx(
        'group flex h-full flex-col rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6',
        'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
        'hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-md)]'
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={clsx(
            'rounded-[4px] border px-2 py-1 text-xs font-medium',
            categoryBadgeClass
          )}
        >
          {post.category}
        </span>
        <time className="text-xs text-[var(--color-text-tertiary)]">
          {formattedDate}
        </time>
      </div>
      <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-toss-blue)]">
        {post.title}
      </h3>
      <p className="mt-2 flex-grow line-clamp-2 text-sm text-[var(--color-text-secondary)]">
        {post.description}
      </p>
      {post.readingTime && (
        <div className="mt-4 text-xs text-[var(--color-text-tertiary)]">
          {post.readingTime}분 읽기
        </div>
      )}
    </Link>
  );
}

export type { PostCardProps };
