'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { PostCategory } from '@/blog/model/types';
import { personalInfo } from '@/resume/model/resume-data';
import { SITE_FEED_PATH } from '@/site/config/site';
import MobileBottomNav from '@/site/navigation/MobileBottomNav';
import { AppSectionIcon } from '@/ui/icons/AppSectionIcon';

type AppSection = 'home' | 'engineering' | 'life' | 'resume';

interface AppShellProps {
  children: ReactNode;
  posts: AppShellPost[];
}

interface AppShellPost {
  slug: string;
  category: PostCategory;
}

interface ExternalLinkItem {
  href: string;
  label: string;
  icon: ReactNode;
}

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
    href: SITE_FEED_PATH,
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

function resolveSection(pathname: string, posts: AppShellPost[]): AppSection {
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

export default function AppShell({ children, posts }: AppShellProps) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeSection = useMemo(
    () => resolveSection(pathname, posts),
    [pathname, posts]
  );

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] md:flex md:h-dvh md:overflow-hidden">
      <aside
        aria-label="Ark 내비게이션"
        className="hidden h-screen w-16 shrink-0 bg-[var(--color-bg-primary)] md:sticky md:top-0 md:flex"
      >
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex justify-center px-1 py-4">
            <Link
              href="/"
              aria-label="ark 홈으로 이동"
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-action)] text-base font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-toss-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
            >
              ark
            </Link>
          </div>

          <nav
            aria-label="Ark 보조 링크"
            className="flex flex-col items-center gap-2 px-2 py-4"
          >
            <Link
              href="/resume"
              aria-label="Resume"
              title="Resume"
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-action)] text-[var(--color-grey-500)] transition-colors hover:text-[var(--color-grey-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
            >
              <AppSectionIcon section="resume" width={18} height={18} />
            </Link>
            {EXTERNAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-action)] text-[var(--color-grey-500)] transition-colors hover:text-[var(--color-grey-900)]"
              >
                {item.icon}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1 bg-[var(--color-bg-primary)] md:flex md:h-dvh md:flex-col md:overflow-hidden">
        <header className="sticky top-0 z-[var(--z-sticky)] bg-[var(--color-bg-primary)] md:hidden">
          <div className="flex h-14 items-center px-4">
            <button
              type="button"
              aria-label={mobileNavOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileNavOpen((current) => !current)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-action)] text-[var(--color-grey-600)] transition-colors hover:text-[var(--color-grey-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
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
          </div>
        </header>

        <div
          data-page-scroll-container
          className="min-h-dvh pb-8 md:min-h-0 md:flex-1 md:overflow-y-auto md:pb-0"
        >
          {children}
        </div>
      </div>

      <MobileBottomNav
        pathname={pathname}
        activeSection={activeSection}
        visible
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
      />
    </div>
  );
}
