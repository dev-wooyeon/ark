'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { AnalyticsEvents, trackEvent } from '@/infra/analytics/lib/analytics';
import { SITE_AUTHOR_EMAIL, SITE_FEED_PATH } from '@/site/config/site';

interface MobileBottomNavProps {
  pathname: string;
  activeSection?: MobileNavItem['id'];
  visible: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface MobileNavItem {
  id: 'home' | 'engineering' | 'life' | 'resume';
  label: string;
  href: string;
}

const NAV_ITEMS: MobileNavItem[] = [
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
];

export default function MobileBottomNav({
  pathname,
  activeSection,
  visible,
  open = false,
  onOpenChange,
}: MobileBottomNavProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[var(--z-overlay)] md:hidden',
        visible && open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        aria-label="메뉴 닫기"
        className={clsx(
          'absolute inset-0 bg-black/20 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => onOpenChange?.(false)}
      />

      <aside
        id="mobile-nav-drawer"
        className={clsx(
          'absolute inset-0 flex flex-col bg-[var(--mobile-nav-bg)] transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        aria-label="모바일 네비게이션"
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--mobile-nav-border)] px-4">
          <p className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
            메뉴
          </p>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => onOpenChange?.(false)}
            className="flex h-11 items-center rounded-[var(--radius-action)] px-2 text-sm font-medium text-[var(--mobile-nav-text)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mobile-nav-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]"
          >
            닫기
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-10">
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection
                ? item.id === activeSection
                : isActiveItem(item, pathname);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    onOpenChange?.(false);
                    trackEvent(AnalyticsEvents.click, {
                      target: 'mobile_nav_drawer',
                      destination: item.href,
                    });
                  }}
                  className={clsx(
                    'flex min-h-14 items-center border-l-2 px-4 text-xl font-semibold tracking-tight transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mobile-nav-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]',
                    isActive
                      ? 'border-[var(--color-toss-blue)] text-[var(--mobile-nav-active-text)]'
                      : 'border-transparent text-[var(--mobile-nav-text)] hover:bg-[var(--mobile-nav-hover-bg)] hover:text-[var(--color-text-primary)]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[var(--mobile-nav-border)] px-6 py-6">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <ExternalLink
              href="https://github.com/dev-wooyeon"
              label="GitHub"
              onNavigate={() => onOpenChange?.(false)}
            />
            <ExternalLink
              href={`mailto:${SITE_AUTHOR_EMAIL}`}
              label="Email"
              onNavigate={() => onOpenChange?.(false)}
            />
            <ExternalLink
              href={SITE_FEED_PATH}
              label="RSS"
              onNavigate={() => onOpenChange?.(false)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function ExternalLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="inline-flex min-h-11 items-center rounded-[var(--radius-action)] px-2 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mobile-nav-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]"
    >
      {label}
    </a>
  );
}

function isActiveItem(item: MobileNavItem, pathname: string): boolean {
  if (item.href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(item.href);
}
