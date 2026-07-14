import Link from 'next/link';
import type { FeedData } from '@/blog/model/types';
import { SITE_DESCRIPTION, SITE_NAME } from '@/site/config/site';

interface HomeHeroProps {
  latestPost?: FeedData;
  postCount: number;
}

export default function HomeHero({ latestPost, postCount }: HomeHeroProps) {
  return (
    <section
      className="grid min-h-96 grid-cols-6 content-between gap-x-6 gap-y-10 py-8 md:gap-x-10 md:py-10"
      aria-labelledby="home-hero-title"
    >
      <div className="col-span-2 flex flex-col justify-between gap-6 md:col-span-1">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-ink">
          {SITE_NAME}
        </p>
        <p className="font-mono text-xs leading-relaxed text-ink-muted">
          Personal log
          <br />
          since 2022
        </p>
      </div>

      <div className="col-span-4 flex flex-col justify-between gap-10 md:col-span-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
          <span
            className="h-1.5 w-1.5 rounded-full bg-home-accent motion-safe:animate-pulse"
            aria-hidden="true"
          />
          Thought in progress
        </div>

        <div>
          <h1
            id="home-hero-title"
            className="max-w-2xl text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl md:text-6xl"
          >
            오래 생각한 것을
            <br />더 멀리 건넵니다.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted md:mt-6 md:text-lg">
            {SITE_DESCRIPTION}
          </p>
        </div>
      </div>

      <div className="col-span-6 flex flex-col justify-between gap-8 border-t border-canvas-border pt-5 md:col-span-2 md:border-t-0 md:pt-0">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            Latest note
          </p>
          {latestPost ? (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="group mt-3 flex items-start justify-between gap-4 text-lg font-medium leading-snug text-ink transition-colors hover:text-home-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
              <span>{latestPost.title}</span>
              <span
                className="shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">
              새 글을 준비하고 있어요.
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-ink-muted">
          <Link
            href="/blog"
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent"
          >
            Archive ({postCount})
          </Link>
          <Link
            href="/resume"
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent"
          >
            Resume
          </Link>
          <Link
            href="/rss.xml"
            className="transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-home-accent"
          >
            RSS
          </Link>
        </div>
      </div>
    </section>
  );
}

export type { HomeHeroProps };
