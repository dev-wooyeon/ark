'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

interface MobileBottomNavProps {
  pathname: string;
  visible: boolean;
}

interface MobileNavItem {
  id: 'theme' | 'blog' | 'home' | 'resume' | 'search';
  label: string;
  href?: string;
  center?: boolean;
  onClick?: () => void;
}

export default function MobileBottomNav({
  pathname,
  visible,
}: MobileBottomNavProps) {
  const { query } = useKBar();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && resolvedTheme === 'dark';
  const nextTheme = isDarkMode ? 'light' : 'dark';

  const navItems = useMemo<MobileNavItem[]>(
    () => [
      {
        id: 'theme',
        label: '테마',
        onClick: () => {
          if (!mounted) return;

          setTheme(nextTheme);
          trackEvent(AnalyticsEvents.theme, {
            from_theme: isDarkMode ? 'dark' : 'light',
            to_theme: nextTheme,
            target: 'mobile_bottom_nav',
          });
        },
      },
      {
        id: 'blog',
        label: '블로그',
        href: '/blog',
      },
      {
        id: 'home',
        label: '홈',
        href: '/',
        center: true,
      },
      {
        id: 'resume',
        label: '이력서',
        href: '/resume',
      },
      {
        id: 'search',
        label: '검색',
        onClick: () => {
          query.toggle();
          trackEvent(AnalyticsEvents.click, {
            target: 'search_button_mobile',
          });
        },
      },
    ],
    [mounted, nextTheme, isDarkMode, query, setTheme]
  );

  return (
    <motion.nav
      initial={false}
      animate={{ y: visible ? 0 : 140, opacity: visible ? 1 : 0.95 }}
      transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
      className="md:hidden fixed inset-x-0 bottom-0 z-[var(--z-mobile-bottom-nav)] px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pointer-events-none"
      aria-label="모바일 하단 네비게이션"
    >
      <div className="mx-auto max-w-[800px] pointer-events-auto">
        <div className="grid grid-cols-5 gap-1 px-2 py-2 rounded-[var(--radius-lg)] border border-[var(--mobile-nav-border)] bg-[var(--mobile-nav-bg)] shadow-[var(--mobile-nav-shadow)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = isActiveItem(item, pathname);
            const itemClassName = clsx(
              'flex min-h-11 items-center justify-center rounded-[var(--radius-md)] px-1 py-1.5 transition-all',
              item.center
                ? 'relative -translate-y-2 border border-[var(--mobile-nav-home-border)] bg-[var(--mobile-nav-home-bg)] shadow-[var(--mobile-nav-home-shadow)]'
                : isActive && 'bg-[var(--mobile-nav-active-bg)]'
            );

            const content = (
              <div className={itemClassName}>
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={clsx(
                      'flex h-5 w-5 items-center justify-center',
                      isActive
                        ? 'text-[var(--mobile-nav-active-text)]'
                        : 'text-[var(--mobile-nav-text)]'
                    )}
                    aria-hidden="true"
                  >
                    <NavIcon id={item.id} isDark={isDarkMode} />
                  </span>
                  <span
                    className={clsx(
                      'text-[11px] font-medium leading-none',
                      isActive
                        ? 'text-[var(--mobile-nav-active-text)]'
                        : 'text-[var(--mobile-nav-text)]'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );

            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] rounded-[var(--radius-md)]"
                  onClick={() =>
                    trackEvent(AnalyticsEvents.click, {
                      target: 'mobile_bottom_nav',
                      destination: item.href,
                    })
                  }
                  aria-current={isActive ? 'page' : undefined}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] rounded-[var(--radius-md)]"
                onClick={item.onClick}
                aria-label={item.label}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

function isActiveItem(item: MobileNavItem, pathname: string): boolean {
  if (!item.href) {
    return false;
  }

  if (item.href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(item.href);
}

function NavIcon({ id, isDark }: { id: MobileNavItem['id']; isDark: boolean }) {
  switch (id) {
    case 'theme':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill={isDark ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isDark ? (
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </>
          )}
        </svg>
      );
    case 'blog':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 12h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case 'home':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
      );
    case 'resume':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );
    case 'search':
      return (
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    default:
      return null;
  }
}
