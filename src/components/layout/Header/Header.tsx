'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';
import MobileBottomNav from './MobileBottomNav';
import { useScrollVisibility } from './useScrollVisibility';

const navItems = [
  { href: '/blog', label: '블로그' },
  { href: '/series', label: '시리즈' },
  { href: '/resume', label: '이력서' },
];

export default function Header() {
  const pathname = usePathname();
  const { topHeaderVisible, bottomBarVisible } = useScrollVisibility(pathname);

  return (
    <>
      <DesktopHeader pathname={pathname} />

      <motion.header
        initial={false}
        animate={{
          height: topHeaderVisible ? 64 : 0,
          opacity: topHeaderVisible ? 1 : 0,
        }}
        transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
        className={clsx(
          'md:hidden sticky top-0 z-[var(--z-mobile-top-header)] overflow-hidden bg-[var(--mobile-top-header-bg)] backdrop-blur-xl',
          topHeaderVisible ? 'border-b border-[var(--mobile-nav-border)]' : '',
          topHeaderVisible ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        <div className="max-w-[800px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)] transition-colors"
            onClick={() =>
              trackEvent(AnalyticsEvents.click, {
                target: 'mobile_top_logo',
                destination: '/',
              })
            }
          >
            <Logo />
            <span>eunu.log</span>
          </Link>

          <ThemeToggle />
        </div>
      </motion.header>

      <MobileBottomNav pathname={pathname} visible={bottomBarVisible} />
    </>
  );
}

interface DesktopHeaderProps {
  pathname: string;
}

function DesktopHeader({ pathname }: DesktopHeaderProps) {
  return (
    <header className="hidden md:block sticky top-0 z-[var(--z-sticky)] bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-grey-100)]">
      <div className="max-w-[800px] mx-auto px-6 h-16 relative flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)] transition-colors z-10"
        >
          <Logo />
          <span>eunu.log</span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  trackEvent(AnalyticsEvents.click, {
                    target: 'header_nav',
                    destination: item.href,
                  })
                }
                className={clsx(
                  'text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'text-[var(--color-toss-blue)]'
                    : 'text-[var(--color-grey-600)] hover:text-[var(--color-toss-blue)]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="w-px h-4 bg-[var(--color-grey-100)]" />

          <div className="flex items-center gap-2">
            <SearchButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchButton() {
  const { query } = useKBar();

  return (
    <button
      onClick={() => {
        query.toggle();
        trackEvent(AnalyticsEvents.click, {
          target: 'search_button',
        });
      }}
      className="flex items-center gap-3 px-3 py-1.5 bg-[var(--color-grey-50)] hover:bg-[var(--color-grey-100)] border border-[var(--color-grey-100)] rounded-lg transition-all group"
    >
      <div className="flex items-center gap-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-grey-400)] group-hover:text-[var(--color-grey-600)] transition-colors"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="text-sm font-medium text-[var(--color-grey-500)] group-hover:text-[var(--color-grey-700)] transition-colors">
          검색
        </span>
      </div>
      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[var(--color-surface)] border border-[var(--color-grey-200)] rounded md:flex hidden">
        <span className="text-[10px] font-bold text-[var(--color-grey-400)]">
          ⌘
        </span>
        <span className="text-[10px] font-bold text-[var(--color-grey-400)]">
          K
        </span>
      </div>
    </button>
  );
}
