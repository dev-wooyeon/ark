'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import Logo from '@/components/ui/Logo';

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
    <header className="sticky top-0 z-[var(--z-sticky)] bg-white/80 backdrop-blur-md border-b border-[var(--color-grey-100)]">
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
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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

        {/* Mobile: Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] rounded-[var(--radius-sm)] transition-colors z-10"
          aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={isMenuOpen}
        >
          <motion.div
            animate={isMenuOpen ? "open" : "closed"}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          >
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 }
              }}
              className="w-6 h-0.5 bg-current block"
            />
            <motion.span
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 }
              }}
              className="w-6 h-0.5 bg-current block"
            />
            <motion.span
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 }
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
            className="md:hidden border-t border-[var(--color-grey-100)] bg-white overflow-hidden absolute w-full left-0 top-16 shadow-xl rounded-b-[var(--radius-lg)]"
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
                      pathname === '/' ? 'text-[var(--color-toss-blue)]' : 'text-[var(--color-grey-900)]'
                    )}
                  >
                    홈
                  </Link>
                </li>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
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
                    <span className="text-xs" aria-hidden="true">↗</span>
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
