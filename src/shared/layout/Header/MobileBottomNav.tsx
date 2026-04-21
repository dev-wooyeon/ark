'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';
import { AppSectionIcon } from '@/shared/ui/icons/AppSectionIcon';

interface MobileBottomNavProps {
  pathname: string;
  visible: boolean;
}

interface MobileNavItem {
  id: 'home' | 'engineering' | 'life' | 'resume';
  label: string;
  href: string;
}

export default function MobileBottomNav({
  pathname,
  visible,
}: MobileBottomNavProps) {
  const navItems = useMemo<MobileNavItem[]>(
    () => [
      {
        id: 'home',
        label: 'Home',
        href: '/',
      },
      {
        id: 'engineering',
        label: 'Tech',
        href: '/engineering',
      },
      {
        id: 'life',
        label: 'Life',
        href: '/life',
      },
      {
        id: 'resume',
        label: 'Resume',
        href: '/resume',
      },
    ],
    []
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
        <div className="grid grid-cols-4 gap-1.5 px-2.5 py-2 rounded-[var(--radius-lg)] border border-[var(--mobile-nav-border)] bg-[var(--mobile-nav-bg)] shadow-[var(--mobile-nav-shadow)] backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = isActiveItem(item, pathname);
            const itemClassName = clsx(
              'flex min-h-14 items-center justify-center rounded-[var(--radius-md)] border px-2 py-2 transition-all group-active:scale-[0.99] group-active:translate-y-[1px]',
              isActive
                ? 'border-[var(--mobile-nav-active-border)] bg-[var(--mobile-nav-active-bg)]'
                : 'border-transparent hover:bg-[var(--mobile-nav-hover-bg)] group-active:bg-[var(--mobile-nav-hover-bg)]'
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
                    <NavIcon id={item.id} />
                  </span>
                  <span
                    className={clsx(
                      'text-[10px] font-semibold leading-none',
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

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() =>
                  trackEvent(AnalyticsEvents.click, {
                    target: 'mobile_bottom_nav',
                    destination: item.href,
                  })
                }
                className="group w-full rounded-[var(--radius-md)] touch-manipulation transition-transform duration-100 active:scale-[0.97] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mobile-nav-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]"
                aria-current={isActive ? 'page' : undefined}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

function isActiveItem(item: MobileNavItem, pathname: string): boolean {
  if (item.href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(item.href);
}

function NavIcon({ id }: { id: MobileNavItem['id'] }) {
  switch (id) {
    case 'engineering':
      return <AppSectionIcon section="engineering" width={16} height={16} />;
    case 'home':
      return <AppSectionIcon section="home" width={16} height={16} />;
    case 'life':
      return <AppSectionIcon section="life" width={16} height={16} />;
    case 'resume':
      return <AppSectionIcon section="resume" width={16} height={16} />;
    default:
      return null;
  }
}
