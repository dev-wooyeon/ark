'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/resume', label: 'Resume' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] bg-white/80 backdrop-blur-md border-b border-[var(--color-grey-100)]">
      <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-[var(--color-grey-900)] hover:text-[var(--color-toss-blue)] transition-colors"
        >
          eunu.log
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx(
                  'text-sm font-medium transition-colors relative py-2',
                  pathname === item.href
                    ? 'text-[var(--color-toss-blue)]'
                    : 'text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)]'
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-[var(--color-toss-blue)]"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] rounded-[var(--radius-sm)] transition-colors"
          aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--color-grey-100)] bg-white overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'block px-4 py-3 rounded-[var(--radius-sm)] text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-[var(--color-toss-blue)]/10 text-[var(--color-toss-blue)]'
                        : 'text-[var(--color-grey-700)] hover:bg-[var(--color-grey-50)]'
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
