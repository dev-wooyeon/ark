'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import type { FeedData } from '@/domains/post/model/types';
import { personalInfo } from '@/features/resume/model/resume-data';
import MobileBottomNav from '@/shared/layout/Header/MobileBottomNav';
import { AppSectionIcon } from '@/shared/ui/icons/AppSectionIcon';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import ThemeTransitionWash from '@/shared/ui/ThemeTransitionWash';

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

const RAIL_NAV_ITEMS: RailNavItem[] = [
  {
    id: 'home',
    href: '/',
    label: 'Home',
    description: '전체 피드와 최근 글',
    icon: <AppSectionIcon section="home" width={16} height={16} />,
  },
  {
    id: 'engineering',
    href: '/engineering',
    label: 'Tech',
    description: '기술 글과 시리즈',
    icon: <AppSectionIcon section="engineering" width={16} height={16} />,
  },
  {
    id: 'life',
    href: '/life',
    label: 'Life',
    description: '에세이와 회고',
    icon: <AppSectionIcon section="life" width={16} height={16} />,
  },
  {
    id: 'resume',
    href: '/resume',
    label: 'Resume',
    description: '경력과 프로젝트',
    icon: <AppSectionIcon section="resume" width={16} height={16} />,
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
        strokeWidth="1.8"
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
        strokeWidth="1.8"
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

function SearchButton() {
  const { query } = useKBar();

  return (
    <button
      type="button"
      onClick={() => query.toggle()}
      className="inline-flex h-11 w-full items-center justify-between gap-3 rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-4 text-sm text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-300)] hover:text-[var(--color-grey-900)]"
      aria-label="검색 열기"
    >
      <span className="flex min-w-0 items-center gap-3">
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
        <span className="truncate">슬래시(/)를 눌러 검색</span>
      </span>
    </button>
  );
}

export default function AppShell({ children, posts }: AppShellProps) {
  const pathname = usePathname();
  const { query } = useKBar();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeSection = useMemo(
    () => resolveSection(pathname, posts),
    [pathname, posts]
  );

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const activeElement = document.activeElement as HTMLElement | null;
      const tagName = activeElement?.tagName;
      const isEditable =
        activeElement?.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT';

      if (isEditable) {
        return;
      }

      event.preventDefault();
      query.toggle();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query]);

  return (
    <div className="min-h-screen bg-[var(--color-grey-50)] text-[var(--color-text-primary)] md:flex md:h-screen md:overflow-hidden">
      <ThemeTransitionWash />

      <aside className="hidden h-screen w-16 shrink-0 border-r border-[var(--color-grey-200)] bg-[var(--color-bg-primary)] md:sticky md:top-0 md:flex">
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex flex-col items-center gap-1 px-1 py-3">
            {RAIL_NAV_ITEMS.map((item) => {
              const isActive = item.id === activeSection;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-label={item.label}
                  className={clsx(
                    'flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-2 transition-colors',
                    isActive
                      ? 'text-[var(--color-toss-blue)]'
                      : 'text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]'
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-10 w-10 items-center justify-center rounded-xl border transition-colors',
                      isActive
                        ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white shadow-sm'
                        : 'border-transparent hover:border-[var(--color-grey-100)] hover:bg-[var(--color-bg-primary)]'
                    )}
                  >
                    {item.icon}
                  </span>
                  <span className="text-center text-xs font-medium leading-none tracking-tight">
                    {item.label}
                  </span>
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
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-[var(--color-bg-primary)] md:flex md:h-screen md:flex-col md:overflow-hidden">
        <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-grey-200)] bg-[var(--color-bg-primary)]/95 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 md:hidden">
            <button
              type="button"
              aria-label={mobileNavOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-300)] hover:text-[var(--color-grey-900)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <SearchButton />
            </div>

            <ThemeToggle />
          </div>

          <div className="hidden h-14 grid-cols-[1fr_minmax(0,560px)_1fr] items-center gap-3 px-6 md:grid">
            <div />
            <div className="flex justify-center">
              <div className="w-full max-w-xl">
                <SearchButton />
              </div>
            </div>

            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="min-h-[calc(100vh-56px)] pb-8 md:min-h-0 md:flex-1 md:overflow-y-auto md:pb-0">
          {children}
        </div>
      </div>

      <MobileBottomNav
        pathname={pathname}
        visible
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />
    </div>
  );
}
