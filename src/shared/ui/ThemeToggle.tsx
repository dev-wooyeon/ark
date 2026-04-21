'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';
import { useEffectiveMotionMode } from '@/shared/motion/model/motion-mode';

export const THEME_TRANSITION_ORIGIN_EVENT = 'theme-transition-origin';

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const effectiveMotionMode = useEffectiveMotionMode();

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

  const isDark = (resolvedTheme ?? theme) === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';
  const isFullMotion = effectiveMotionMode === 'full';
  const isReducedMotion = effectiveMotionMode === 'reduced';

  return (
    <motion.button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        window.dispatchEvent(
          new CustomEvent(THEME_TRANSITION_ORIGIN_EVENT, {
            detail: {
              x: centerX,
              y: centerY,
              nextTheme,
            },
          })
        );

        setTheme(nextTheme);
        trackEvent(AnalyticsEvents.theme, {
          from_theme: isDark ? 'dark' : 'light',
          to_theme: nextTheme,
        });
      }}
      className="relative inline-flex h-11 w-[88px] items-center rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] px-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)]"
      aria-label={`${isDark ? '라이트' : '다크'} 모드로 전환`}
      whileTap={isFullMotion ? { scale: 0.97 } : undefined}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 rounded-full"
        initial={false}
        animate={{
          opacity: isDark ? 0.16 : 0.1,
          scale: isDark ? 1.02 : 0.98,
        }}
        transition={{
          duration: isReducedMotion ? 0.12 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          background: isDark
            ? 'radial-gradient(circle at 72% 50%, rgba(49,130,246,0.22), transparent 60%)'
            : 'radial-gradient(circle at 28% 50%, rgba(251,191,36,0.22), transparent 58%)',
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute top-1/2 h-7 w-7 rounded-full bg-[var(--color-bg-primary)] shadow-sm"
        initial={false}
        animate={{
          x: isDark ? 40 : 0,
          y: '-50%',
          scaleX: isFullMotion ? [1, 1.16, 1] : 1,
          rotate: isFullMotion ? (isDark ? -10 : 10) : 0,
        }}
        transition={{
          x: {
            type: 'spring',
            stiffness: 360,
            damping: 24,
          },
          scaleX: {
            duration: isReducedMotion ? 0.12 : 0.26,
            ease: [0.22, 1, 0.36, 1],
          },
          rotate: {
            duration: isReducedMotion ? 0.12 : 0.26,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        style={{
          transformOrigin: isDark ? 'right center' : 'left center',
        }}
      />

      <span className="relative z-[1] flex w-full items-center justify-between text-[var(--color-grey-500)]">
        <motion.span
          className="flex h-7 w-7 items-center justify-center"
          aria-hidden="true"
          initial={false}
          animate={{
            scale: isDark ? 0.88 : 1.04,
            rotate: isDark ? -24 : 0,
            opacity: isDark ? 0.45 : 1,
          }}
          transition={{
            duration: isReducedMotion ? 0.12 : 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
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
        </motion.span>

        <motion.span
          className="flex h-7 w-7 items-center justify-center"
          aria-hidden="true"
          initial={false}
          animate={{
            scale: isDark ? 1.04 : 0.88,
            rotate: isDark ? 0 : 20,
            opacity: isDark ? 1 : 0.45,
          }}
          transition={{
            duration: isReducedMotion ? 0.12 : 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
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
        </motion.span>
      </span>
    </motion.button>
  );
}
