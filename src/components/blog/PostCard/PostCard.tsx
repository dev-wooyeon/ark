import Link from 'next/link';
import { clsx } from 'clsx';
import { FeedData } from '@/types';

interface PostCardProps {
  post: FeedData;
  variant?: 'default' | 'featured';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        'group flex flex-col h-full p-6 rounded-[var(--radius-md)] border border-[var(--color-grey-200)] bg-white',
        'transition-all duration-[var(--duration-200)] ease-[var(--ease-default)]',
        'hover:border-[var(--color-grey-300)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-[var(--color-toss-blue)] bg-[var(--color-toss-blue)]/10 px-2 py-1 rounded-[4px]">
          {post.category}
        </span>
        <time className="text-xs text-[var(--color-grey-500)]">
          {formattedDate}
        </time>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-grey-900)] group-hover:text-[var(--color-toss-blue)] transition-colors leading-snug line-clamp-2">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--color-grey-600)] line-clamp-2 flex-grow">
        {post.description}
      </p>
      {post.readingTime && (
        <div className="mt-4 text-xs text-[var(--color-grey-500)]">
          {post.readingTime}분 읽기
        </div>
      )}
    </Link>
  );
}

export type { PostCardProps };
