'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import Logo from '@/shared/ui/Logo';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';
import MobileBottomNav from './MobileBottomNav';
import { useScrollVisibility } from './useScrollVisibility';

const navItems = [
  { href: '/engineering', label: 'Engineering' },
  { href: '/life', label: 'Life' },
  { href: '/resume', label: 'Resume' },
];

export default function Header() {
  const pathname = usePathname();
  const { topHeaderVisible, bottomBarVisible } = useScrollVisibility(pathname);

  return (
    <>
      <DesktopHeader />

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

          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <MobileBottomNav pathname={pathname} visible={bottomBarVisible} />
    </>
  );
}

function DesktopHeader() {
  return (
    <header className="hidden md:block sticky top-0 z-[var(--z-sticky)] bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-grey-100)]">
      <div className="max-w-[800px] mx-auto px-6 h-14 relative flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)] transition-colors z-10"
        >
          <Logo />
          <span>eunu.log</span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-2.5">
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
                  'inline-flex min-h-9 items-center rounded-lg px-3 text-[15px] font-medium text-[var(--color-grey-600)] transition-colors',
                  'hover:bg-[var(--color-grey-50)] hover:text-[var(--color-toss-blue)]'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-1 flex items-center gap-2 border-l border-[var(--color-grey-100)] pl-3">
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
      type="button"
      aria-label="검색 열기"
      onClick={() => {
        query.toggle();
        trackEvent(AnalyticsEvents.click, {
          target: 'search_button',
        });
      }}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-grey-100)] bg-[var(--color-grey-50)] transition-all hover:bg-[var(--color-grey-100)] active:scale-[0.98] active:translate-y-[1px] group"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[var(--color-grey-400)] transition-colors group-hover:text-[var(--color-grey-600)]"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  );
}
