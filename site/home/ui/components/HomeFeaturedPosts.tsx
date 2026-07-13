import Link from 'next/link';
import type { FeedData } from '@/blog/model/types';
import { CategoryIcon } from '@/ui/icons/AppSectionIcon';

interface HomeFeaturedPostsProps {
  posts: FeedData[];
}

export default function HomeFeaturedPosts({ posts }: HomeFeaturedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="home-featured-title">
      <div>
        <p className="text-meta font-semibold text-[var(--color-text-tertiary)]">
          처음 방문했다면
        </p>
        <h2
          id="home-featured-title"
          className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)]"
        >
          먼저 읽을 글
        </h2>
      </div>

      <ol className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0">
        {posts.map((post, index) => (
          <li key={post.slug} className="min-w-64 snap-start sm:min-w-0">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full gap-3 rounded-[var(--radius-content)] border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 transition-colors hover:border-[var(--color-border-hover)] hover:bg-[var(--color-grey-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
            >
              <span className="text-meta font-semibold tabular-nums text-[var(--color-toss-blue)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-meta text-[var(--color-text-tertiary)]">
                  <CategoryIcon category={post.category} />
                  {post.category}
                </span>
                <span className="mt-1.5 line-clamp-2 block text-base font-bold leading-snug text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-toss-blue)]">
                  {post.title}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export type { HomeFeaturedPostsProps };
