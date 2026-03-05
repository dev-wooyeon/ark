'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { FeedData } from '@/domains/post/model/types';
import type { SeriesSummary } from '@/features/blog/model/series-group';
import { Container } from '@/shared/layout';
import { trackEvent } from '@/shared/analytics/lib/analytics';
import { Button } from '@/shared/ui';

interface HeroSectionProps {
  allArticles: FeedData[];
  seriesSummaries: SeriesSummary[];
  popularPosts: Array<{
    post: FeedData;
    viewCount: number | null;
  }>;
}

const ARTICLE_PAGE_SIZE = 5;
const HERO_ACTION_BUTTON_CLASS =
  '!h-11 !bg-[rgba(0,12,30,0.8)] !backdrop-blur-md !border !border-white/10 !text-white transition-all shadow-lg hover:!bg-[rgba(0,12,30,1)] hover:shadow-xl hover:-translate-y-0.5';
const HERO_ACTION_CONTENT_CLASS = 'inline-flex items-center gap-2';
const PANEL_SPRING = {
  stiffness: 110,
  damping: 24,
  mass: 0.28,
};

function useSoftRevealMotion(
  targetRef: React.RefObject<HTMLElement | null>,
  prefersReducedMotion: boolean
) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 92%', 'start 58%'],
  });
  const smoothProgress = useSpring(scrollYProgress, PANEL_SPRING);

  const opacity = useTransform(smoothProgress, [0, 0.45, 1], [0.08, 0.5, 1]);
  const y = useTransform(smoothProgress, [0, 1], [24, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.985, 1]);

  if (prefersReducedMotion) {
    return undefined;
  }

  return {
    opacity,
    y,
    scale,
  };
}

function CategoryPill({ post }: { post: FeedData }) {
  const toneClass =
    post.category === 'Tech'
      ? 'bg-[var(--color-toss-blue)]/10 text-[var(--color-toss-blue)]'
      : 'bg-[var(--color-grey-100)] text-[var(--color-grey-700)]';

  return (
    <span
      className={`rounded px-2 py-0.5 text-[11px] font-semibold ${toneClass}`}
    >
      {post.category}
    </span>
  );
}

function ArticleThumbnail({ post }: { post: FeedData }) {
  return (
    <div className="hidden h-24 w-40 shrink-0 self-center sm:block" aria-hidden="true">
      {post.image ? (
        <div className="h-full w-full overflow-hidden rounded-xl">
          <Image
            src={post.image}
            alt=""
            width={320}
            height={192}
            sizes="160px"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

function PopularPostList({
  popularPosts,
}: {
  popularPosts: HeroSectionProps['popularPosts'];
}) {
  const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

  if (popularPosts.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-grey-100)] bg-[var(--color-grey-50)] px-4 py-6 text-sm text-[var(--color-grey-600)]">
        인기 글을 집계하고 있어요.
      </div>
    );
  }

  return (
    <ol className="m-0 list-none space-y-3 p-0">
      {popularPosts.map(({ post }, index) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            onClick={() =>
              trackEvent('cta_click', {
                cta_name: 'home_popular_post',
                cta_location: 'home_popular',
                destination: `/blog/${post.slug}`,
                rank: index + 1,
              })
            }
            className="group flex h-24 items-center gap-3 overflow-hidden rounded-lg border border-[var(--color-grey-100)] bg-[var(--color-bg-primary)] px-4 py-3 transition-all hover:border-[var(--color-grey-300)] hover:bg-[var(--color-grey-50)] hover:shadow-sm"
          >
            <span
              className="tossface w-6 text-center text-sm text-[var(--color-grey-600)]"
              aria-hidden="true"
            >
              {rankEmojis[index] ?? '•'}
            </span>
            <div className="flex min-w-0 flex-1 items-center">
              <p className="m-0 line-clamp-2 text-base font-semibold leading-snug text-[var(--color-grey-900)] group-hover:text-[var(--color-toss-blue)]">
                {post.title}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function SeriesList({ seriesSummaries }: { seriesSummaries: SeriesSummary[] }) {
  if (seriesSummaries.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-grey-100)] bg-[var(--color-grey-50)] px-4 py-6 text-sm text-[var(--color-grey-600)]">
        연재 글이 준비되면 바로 보여드려요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {seriesSummaries.map((summary) => {
        return (
          <Link
            key={summary.id}
            href={`/engineering/series/${encodeURIComponent(summary.id)}`}
            onClick={() =>
              trackEvent('cta_click', {
                cta_name: 'home_series_hub',
                cta_location: 'home_series',
                destination: `/engineering/series/${summary.id}`,
              })
            }
            className="group flex h-24 items-center justify-between gap-3 overflow-hidden rounded-lg border border-[var(--color-grey-100)] bg-[var(--color-bg-primary)] px-4 py-3 transition-all hover:border-[var(--color-grey-300)] hover:bg-[var(--color-grey-50)] hover:shadow-sm"
          >
            <div className="flex min-w-0 flex-1 items-center">
              <p className="m-0 line-clamp-2 text-base font-semibold leading-snug text-[var(--color-grey-900)] group-hover:text-[var(--color-toss-blue)]">
                {summary.title}
              </p>
            </div>
            <span className="shrink-0 self-center text-xs font-medium text-[var(--color-grey-500)]">
              {summary.postCount}개 글
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function HeroActionIcon({ children }: { children: string }) {
  return (
    <span
      className="tossface inline-flex w-5 shrink-0 items-center justify-center text-base leading-none"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function HeroActionLabel({ children }: { children: string }) {
  return (
    <span
      className="inline-block min-w-0 text-sm font-medium leading-none"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {children}
    </span>
  );
}

function HeroActionContent({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <span className={HERO_ACTION_CONTENT_CLASS}>
      <HeroActionIcon>{icon}</HeroActionIcon>
      <HeroActionLabel>{label}</HeroActionLabel>
    </span>
  );
}

export default function HeroSection({
  allArticles,
  seriesSummaries,
  popularPosts,
}: HeroSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const articlePanelRef = useRef<HTMLElement>(null);
  const popularPanelRef = useRef<HTMLElement>(null);
  const seriesPanelRef = useRef<HTMLElement>(null);

  const articlePosts = useMemo(
    () => allArticles.filter((post) => !post.series),
    [allArticles]
  );

  const totalPages = Math.max(
    1,
    Math.ceil(articlePosts.length / ARTICLE_PAGE_SIZE)
  );

  const displaySeries = useMemo(
    () => seriesSummaries.slice(0, 5),
    [seriesSummaries]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ARTICLE_PAGE_SIZE;
    return articlePosts.slice(startIndex, startIndex + ARTICLE_PAGE_SIZE);
  }, [articlePosts, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );
  const articleMotion = useSoftRevealMotion(articlePanelRef, prefersReducedMotion);
  const popularMotion = useSoftRevealMotion(popularPanelRef, prefersReducedMotion);
  const seriesMotion = useSoftRevealMotion(seriesPanelRef, prefersReducedMotion);

  return (
    <section className="relative bg-[var(--color-bg-primary)]">
      <Container
        size="md"
        className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pb-16 pt-20 text-center md:pt-24"
      >
        <div>
          <h1 className="text-5xl font-bold leading-tight text-[var(--color-grey-900)] md:text-6xl">
            안녕하세요, 우연입니다
          </h1>

          <div className="mt-6 text-lg leading-tight font-mono text-[var(--color-grey-800)]">
            <p>
              Make Creative, Data, Systems things.
              <br />
              Currently working as a Software Engineer{' '}
              <a href="https://981park.com">@9.81park</a>.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              as="a"
              href="/engineering"
              onClick={() =>
                trackEvent('cta_click', {
                  cta_name: 'view_engineering',
                  cta_location: 'home_hero',
                  destination: '/engineering',
                })
              }
              className={HERO_ACTION_BUTTON_CLASS}
            >
              <HeroActionContent icon="📝" label="아티클 보기" />
            </Button>
            <Button
              as="a"
              href="/resume"
              onClick={() =>
                trackEvent('cta_click', {
                  cta_name: 'view_resume',
                  cta_location: 'home_hero',
                  destination: '/resume',
                })
              }
              className={HERO_ACTION_BUTTON_CLASS}
            >
              <HeroActionContent icon="👨‍💻" label="이력서 보기" />
            </Button>
          </div>
        </div>

        <button
          type="button"
          aria-label="전체 아티클 보기"
          onClick={() => {
            document
              .getElementById('home-content')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[var(--color-grey-700)] opacity-80 transition-all hover:opacity-100"
        >
          <span
            className="font-semibold leading-none tracking-widest uppercase"
            style={{ fontSize: '10px' }}
          >
            Scroll down
          </span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ objectFit: 'fill' }}
          >
            <rect
              x="4"
              y="1.5"
              width="14"
              height="19"
              rx="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="10.1"
              y="8.3"
              width="1.8"
              height="5.4"
              rx="0.9"
              fill="currentColor"
              className="animate-scroll-wheel-drag"
            />
          </svg>
        </button>
      </Container>

      <section id="home-content">
        <Container size="md" className="pb-16 pt-8 md:pb-20 md:pt-10">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
            <motion.section
              ref={articlePanelRef}
              id="home-article-list"
              className="will-change-transform lg:col-span-2"
              style={articleMotion}
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
                  전체 아티클
                </h2>
                <div className="flex items-center gap-3">
                  <Link
                    href="/engineering"
                    className="text-sm font-semibold text-[var(--color-toss-blue)] hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {pagedArticles.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={() =>
                      trackEvent('cta_click', {
                        cta_name: 'home_spotlight_post',
                        cta_location: 'home_article',
                        destination: `/blog/${post.slug}`,
                      })
                    }
                    className="group flex h-36 items-center justify-between gap-4 rounded-lg border border-[var(--color-grey-100)] bg-[var(--color-bg-primary)] px-4 py-4 transition-all hover:border-[var(--color-grey-300)] hover:bg-[var(--color-grey-100)] hover:shadow-sm"
                  >
                    <div className="flex h-full min-w-0 flex-1 flex-col justify-start">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <CategoryPill post={post} />
                      </div>
                      <p className="m-0 text-base font-semibold text-[var(--color-grey-900)] group-hover:text-[var(--color-toss-blue)]">
                        {post.title}
                      </p>
                      <p className="mt-2 line-clamp-2 overflow-hidden text-ellipsis text-sm text-[var(--color-grey-600)]">
                        {post.description}
                      </p>
                    </div>
                    <ArticleThumbnail post={post} />
                  </Link>
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                    className="tossface rounded border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-[var(--color-grey-700)] transition-colors hover:bg-[var(--color-grey-50)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    &lt;
                  </button>
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={
                        page === currentPage
                          ? 'rounded border border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] px-3 py-1.5 text-white'
                          : 'rounded border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-[var(--color-grey-700)] transition-colors hover:bg-[var(--color-grey-50)]'
                      }
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                    className="tossface rounded border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-[var(--color-grey-700)] transition-colors hover:bg-[var(--color-grey-50)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    &gt;
                  </button>
                </div>
              ) : null}
            </motion.section>

            <aside className="space-y-8 lg:col-span-1">
              <motion.section
                ref={popularPanelRef}
                className="will-change-transform"
                style={popularMotion}
              >
                <header className="mb-3">
                  <h2 className="text-xl font-bold text-[var(--color-grey-900)]">
                    인기 글
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-grey-500)]">
                    최근 30일 기준으로 많이 본 글이에요
                  </p>
                </header>
                <PopularPostList popularPosts={popularPosts} />
              </motion.section>

              <motion.section
                ref={seriesPanelRef}
                className="will-change-transform"
                style={seriesMotion}
              >
                <div className="mb-3 flex items-end justify-between">
                  <h2 className="text-xl font-bold text-[var(--color-grey-900)]">
                    아티클 시리즈
                  </h2>
                  <Link
                    href="/engineering"
                    className="text-sm font-semibold text-[var(--color-toss-blue)] hover:underline"
                  >
                    전체 보기
                  </Link>
                </div>
                <SeriesList seriesSummaries={displaySeries} />
              </motion.section>
            </aside>
          </div>
        </Container>
      </section>
    </section>
  );
}
