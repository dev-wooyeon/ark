'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useKBar } from 'kbar';
import { clsx } from 'clsx';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

const navItems = [
  { href: '/blog', label: '블로그' },
  { href: '/resume', label: '이력서' },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/dev-wooyeon' },
  { name: 'Email', href: 'mailto:une@kakao.com' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] bg-[var(--color-bg-primary)]/80 backdrop-blur-md border-b border-[var(--color-grey-100)]">
      <div className="max-w-[800px] mx-auto px-6 h-16 relative flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)] transition-colors z-10"
        >
          <Logo />
          <span>eunu.log</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
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

        {/* Mobile: Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] rounded-[var(--radius-sm)] transition-colors z-10"
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
        >
          <motion.div
            animate={isMenuOpen ? 'open' : 'closed'}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
              className="w-6 h-0.5 bg-current block"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
              className="w-6 h-0.5 bg-current block"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
              className="w-6 h-0.5 bg-current block"
            />
          </motion.div>
        </button>
      </div>

      {/* Full Width Menu Dropdown (Mobile) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }} // Toss easing
            className="md:hidden border-t border-[var(--color-grey-100)] bg-[var(--color-bg-primary)] overflow-hidden absolute w-full left-0 top-16 shadow-xl rounded-b-[var(--radius-lg)]"
          >
            <div className="max-w-[800px] mx-auto px-6 py-8 flex flex-col gap-8">
              {/* Main Nav Links */}
              <ul className="flex flex-col gap-4">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      'block text-3xl font-bold transition-all duration-200 hover:translate-x-2',
                      pathname === '/'
                        ? 'text-[var(--color-toss-blue)]'
                        : 'text-[var(--color-grey-900)]'
                    )}
                  >
                    홈
                  </Link>
                </li>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setIsMenuOpen(false);
                        trackEvent(AnalyticsEvents.click, {
                          target: 'header_nav_mobile',
                          destination: item.href,
                        });
                      }}
                      className={clsx(
                        'block text-3xl font-bold transition-all duration-200 hover:translate-x-2',
                        pathname === item.href
                          ? 'text-[var(--color-toss-blue)]'
                          : 'text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div className="border-t border-[var(--color-grey-100)] pt-6 flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-[var(--color-grey-600)] hover:text-[var(--color-toss-blue)] transition-colors flex items-center gap-2"
                  >
                    {link.name}
                    <span className="text-xs" aria-hidden="true">
                      ↗
                    </span>
                    <span className="sr-only">새 탭에서 열림</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
