'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import { getSeriesSummaries } from '@/features/blog/model/series-group';
import { personalInfo } from '@/features/resume/model/resume-data';
import ThemeToggle from '@/shared/ui/ThemeToggle';

type AppSection = 'home' | 'engineering' | 'life' | 'resume';

interface AppShellProps {
  children: ReactNode;
  posts: FeedData[];
}

interface RailNavItem {
  id: AppSection;
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
}

interface ExternalLinkItem {
  href: string;
  label: string;
  icon: ReactNode;
}

const DESKTOP_PANEL_WIDTH = 'clamp(220px, 18vw, 280px)';

const RAIL_NAV_ITEMS: RailNavItem[] = [
  {
    id: 'home',
    href: '/',
    label: '홈',
    description: '전체 피드와 최근 글',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    id: 'engineering',
    href: '/engineering',
    label: 'Engineering',
    description: '기술 글과 시리즈',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: 'life',
    href: '/life',
    label: 'Life',
    description: '에세이와 회고',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21c-4.97 0-9-3.58-9-8 0-6 9-11 9-11s9 5 9 11c0 4.42-4.03 8-9 8Z" />
        <path d="M12 21v-8" />
      </svg>
    ),
  },
  {
    id: 'resume',
    href: '/resume',
    label: 'Resume',
    description: '경력과 프로젝트',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8" />
        <path d="M8 11h8" />
        <path d="M8 15h5" />
      </svg>
    ),
  },
];

const EXTERNAL_LINKS: ExternalLinkItem[] = [
  {
    href: personalInfo.github,
    label: 'GitHub',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.09 3.29 9.4 7.86 10.92.58.11.79-.25.79-.56 0-.28-.01-1.2-.02-2.18-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.97.1-.75.4-1.26.72-1.56-2.56-.29-5.25-1.29-5.25-5.74 0-1.27.45-2.31 1.19-3.12-.12-.29-.51-1.46.11-3.05 0 0 .98-.31 3.2 1.19a11 11 0 0 1 5.83 0c2.21-1.5 3.19-1.19 3.19-1.19.63 1.59.24 2.76.12 3.05.74.81 1.19 1.85 1.19 3.12 0 4.46-2.69 5.45-5.26 5.73.41.35.78 1.04.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.68.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.66 18.35.5 12 .5Z" />
      </svg>
    ),
  },
  {
    href: `mailto:${personalInfo.email}`,
    label: 'Email',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    href: '/feed.xml',
    label: 'RSS',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
}

function resolveSection(pathname: string, posts: FeedData[]): AppSection {
  if (pathname.startsWith('/resume')) {
    return 'resume';
  }

  if (pathname.startsWith('/life')) {
    return 'life';
  }

  if (pathname.startsWith('/engineering') || pathname.startsWith('/series')) {
    return 'engineering';
  }

  if (pathname.startsWith('/blog/')) {
    const slug = pathname.slice('/blog/'.length);
    const matchedPost = posts.find((post) => post.slug === slug);

    if (matchedPost?.category === 'Life') {
      return 'life';
    }

    if (matchedPost?.category === 'Tech') {
      return 'engineering';
    }
  }

  return 'home';
}

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-grey-500)]">
        {title}
      </h2>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function SidebarRow({
  href,
  title,
  detail,
  active = false,
}: {
  href: string;
  title: string;
  detail?: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'block border-l-2 py-2 pl-3 transition-colors',
        active
          ? 'border-[var(--color-toss-blue)] text-[var(--color-grey-900)]'
          : 'border-transparent text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)]'
      )}
    >
      <p
        className={clsx(
          'text-sm leading-6',
          active ? 'font-semibold' : 'font-medium'
        )}
      >
        {title}
      </p>
      {detail ? (
        <p className="mt-1 text-xs text-[var(--color-grey-500)]">{detail}</p>
      ) : null}
    </Link>
  );
}

function SearchButton() {
  const { query } = useKBar();

  return (
    <button
      type="button"
      onClick={() => query.toggle()}
      className="inline-flex h-11 w-full items-center gap-3 rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-4 text-sm text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-300)] hover:text-[var(--color-grey-900)]"
      aria-label="검색 열기"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="truncate">검색어, 태그, 글 제목 검색</span>
    </button>
  );
}

export default function AppShell({ children, posts }: AppShellProps) {
  const pathname = usePathname();
  const [desktopPanelOpen, setDesktopPanelOpen] = useState(true);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  useEffect(() => {
    setMobilePanelOpen(false);
  }, [pathname]);

  const activeSection = useMemo(
    () => resolveSection(pathname, posts),
    [pathname, posts]
  );

  const techPosts = useMemo(
    () => posts.filter((post) => post.category === 'Tech'),
    [posts]
  );
  const lifePosts = useMemo(
    () => posts.filter((post) => post.category === 'Life'),
    [posts]
  );
  const seriesSummaries = useMemo(() => getSeriesSummaries(techPosts), [techPosts]);

  const sidebarContent = useMemo(() => {
    switch (activeSection) {
      case 'engineering':
        return (
          <>
            <PanelSection title="Engineering">
              <SidebarRow
                href="/engineering"
                title="기술 피드"
                detail={`${techPosts.length}개의 기술 글`}
                active={pathname === '/engineering'}
              />
              <SidebarRow
                href="/series"
                title="시리즈 모아보기"
                detail={`${seriesSummaries.length}개 시리즈`}
                active={pathname === '/series'}
              />
            </PanelSection>

            <PanelSection title="최근 기술 글">
              {techPosts.slice(0, 6).map((post) => (
                <SidebarRow
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  detail={formatDate(post.date)}
                  active={pathname === `/blog/${post.slug}`}
                />
              ))}
            </PanelSection>
          </>
        );
      case 'life':
        return (
          <>
            <PanelSection title="Life">
              <SidebarRow
                href="/life"
                title="에세이와 회고"
                detail={`${lifePosts.length}개의 글`}
                active={pathname === '/life'}
              />
            </PanelSection>

            <PanelSection title="최근 Life 글">
              {lifePosts.slice(0, 6).map((post) => (
                <SidebarRow
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  detail={formatDate(post.date)}
                  active={pathname === `/blog/${post.slug}`}
                />
              ))}
            </PanelSection>
          </>
        );
      case 'resume':
        return (
          <>
            <PanelSection title="Resume">
              <SidebarRow
                href="/resume"
                title={personalInfo.name}
                detail={personalInfo.position}
                active={pathname === '/resume'}
              />
            </PanelSection>

            <PanelSection title="바로가기">
              <SidebarRow href="/resume#skills" title="Skills" />
              <SidebarRow href="/resume#experience" title="Experience" />
              <SidebarRow href="/resume#projects" title="Projects" />
              <SidebarRow href="/resume#education" title="Education" />
            </PanelSection>
          </>
        );
      case 'home':
      default:
        return (
          <>
            <PanelSection title="컬렉션">
              <SidebarRow
                href="/"
                title="전체 피드"
                detail={`${posts.length}개의 글`}
                active={pathname === '/'}
              />
              <SidebarRow
                href="/engineering"
                title="Engineering"
                detail={`${techPosts.length}개의 기술 글`}
              />
              <SidebarRow
                href="/life"
                title="Life"
                detail={`${lifePosts.length}개의 회고와 에세이`}
              />
            </PanelSection>

            <PanelSection title="최근 글">
              {posts.slice(0, 7).map((post) => (
                <SidebarRow
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  detail={formatDate(post.date)}
                  active={pathname === `/blog/${post.slug}`}
                />
              ))}
            </PanelSection>
          </>
        );
    }
  }, [activeSection, lifePosts, pathname, posts, seriesSummaries, techPosts]);

  const desktopPanelWidth = desktopPanelOpen ? DESKTOP_PANEL_WIDTH : '0px';

  return (
    <div className="min-h-screen bg-[var(--color-grey-50)] text-[var(--color-text-primary)] md:flex">
      <aside className="hidden min-h-screen w-16 shrink-0 border-r border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] md:flex md:flex-col md:justify-between">
        <div className="flex flex-col items-center gap-2 px-2 py-4">
          {RAIL_NAV_ITEMS.map((item) => {
            const isActive = item.id === activeSection;

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={item.label}
                className={clsx(
                  'flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors',
                  isActive
                    ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white shadow-sm'
                    : 'border-transparent text-[var(--color-grey-500)] hover:border-[var(--color-grey-100)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-grey-900)]'
                )}
              >
                {item.icon}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 px-2 py-4">
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-100)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-grey-900)]"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </aside>

      <aside
        className="hidden shrink-0 overflow-hidden border-r border-[var(--color-grey-200)] bg-[var(--color-grey-50)] transition-[width] duration-200 md:flex"
        style={{ width: desktopPanelWidth }}
      >
        <div
          className={clsx(
            'w-full min-w-0 px-4 py-6',
            desktopPanelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          {desktopPanelOpen ? sidebarContent : null}
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-[var(--color-bg-primary)]">
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-grey-200)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md">
          <div className="grid h-14 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 px-4 md:grid-cols-[40px_minmax(320px,560px)_auto] md:justify-center md:px-6">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth >= 768) {
                  setDesktopPanelOpen((current) => !current);
                  return;
                }

                setMobilePanelOpen((current) => !current);
              }}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] text-[var(--color-grey-600)] transition-colors hover:bg-[var(--color-grey-50)] hover:text-[var(--color-grey-900)]"
              aria-label="사이드바 토글"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="w-full max-w-[560px] justify-self-center">
              <SearchButton />
            </div>

            <div className="flex items-center justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-56px)]">{children}</div>
      </div>

      <AnimatePresence>
        {mobilePanelOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="모바일 사이드바 닫기"
              className="fixed inset-0 z-[60] bg-black/30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobilePanelOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-[61] flex w-full max-w-sm overflow-hidden border-r border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] md:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex w-16 shrink-0 flex-col justify-between border-r border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-2 py-4">
                <div className="flex flex-col items-center gap-2">
                  {RAIL_NAV_ITEMS.map((item) => {
                    const isActive = item.id === activeSection;

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        aria-label={item.label}
                        className={clsx(
                          'flex h-11 w-11 items-center justify-center rounded-2xl border transition-colors',
                          isActive
                            ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white shadow-sm'
                            : 'border-transparent text-[var(--color-grey-500)] hover:border-[var(--color-grey-100)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-grey-900)]'
                        )}
                      >
                        {item.icon}
                      </Link>
                    );
                  })}
                </div>

                <div className="flex flex-col items-center gap-2">
                  {EXTERNAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-100)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-grey-900)]"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="min-w-0 flex-1 overflow-y-auto bg-[var(--color-grey-50)] px-4 py-6">
                {sidebarContent}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
