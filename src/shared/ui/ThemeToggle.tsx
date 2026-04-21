'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-11 w-[88px] items-center rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-2">
        <div className="h-7 w-7 rounded-full bg-[var(--color-grey-200)] animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(nextTheme);
        trackEvent(AnalyticsEvents.theme, {
          from_theme: isDark ? 'dark' : 'light',
          to_theme: nextTheme,
        });
      }}
      className="relative inline-flex h-11 w-[88px] items-center rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)]"
      aria-label={`${isDark ? '라이트' : '다크'} 모드로 전환`}
    >
      <motion.span
        aria-hidden="true"
        className="absolute top-1/2 h-7 w-7 rounded-full bg-[var(--color-bg-primary)] shadow-sm"
        initial={false}
        animate={{
          x: isDark ? 40 : 0,
          y: '-50%',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      />

      <span className="relative z-[1] flex w-full items-center justify-between text-[var(--color-grey-500)]">
        <span
          className="flex h-7 w-7 items-center justify-center"
          aria-hidden="true"
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
            className={isDark ? 'text-[var(--color-grey-400)]' : 'text-amber-500'}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </span>

        <span
          className="flex h-7 w-7 items-center justify-center"
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={isDark ? 'text-[var(--color-toss-blue)]' : 'text-[var(--color-grey-400)]'}
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
