'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';
import { AppSectionIcon } from '@/shared/ui/icons/AppSectionIcon';

interface MobileBottomNavProps {
  pathname: string;
  visible: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface MobileNavItem {
  id: 'home' | 'engineering' | 'life' | 'resume';
  label: string;
  href: string;
}

export default function MobileBottomNav({
  pathname,
  visible,
  open = false,
  onOpenChange,
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
    >
      <button
        type="button"
        aria-label="메뉴 닫기"
        className={clsx(
          'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => onOpenChange?.(false)}
      />

      <aside
        id="mobile-nav-drawer"
        className={clsx(
          'absolute inset-y-0 left-0 flex w-72 max-w-full flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-xl transition-transform',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="모바일 네비게이션"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-grey-400)]">
              탐색
            </p>
            <p className="mt-1 text-sm text-[var(--color-grey-500)]">
              블로그 섹션과 외부 링크
            </p>
          </div>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => onOpenChange?.(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] text-[var(--color-grey-500)] transition-colors hover:border-[var(--color-grey-300)] hover:text-[var(--color-grey-900)]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = isActiveItem(item, pathname);

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
                  'flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mobile-nav-focus-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]',
                  isActive
                    ? 'border-[var(--mobile-nav-active-border)] bg-[var(--mobile-nav-active-bg)]'
                    : 'border-transparent hover:bg-[var(--mobile-nav-hover-bg)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={clsx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
                    isActive
                      ? 'border-[var(--color-toss-blue)] bg-[var(--color-toss-blue)] text-white'
                      : 'border-[var(--color-border)] bg-[var(--color-grey-50)] text-[var(--mobile-nav-text)]'
                  )}
                  aria-hidden="true"
                >
                  <NavIcon id={item.id} />
                </span>
                <span className="min-w-0">
                  <span
                    className={clsx(
                      'block text-sm font-semibold',
                      isActive
                        ? 'text-[var(--mobile-nav-active-text)]'
                        : 'text-[var(--color-text-primary)]'
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--color-grey-500)]">
                    {getDescription(item.id)}
                  </span>
                </span>
              </Link>
            );
          })}
          </div>
        </nav>

        <div className="border-t border-[var(--color-border)] px-3 py-3">
          <div className="space-y-1.5">
            <ExternalLink
              href="https://github.com/dev-wooyeon"
              label="GitHub"
              onNavigate={() => onOpenChange?.(false)}
            />
            <ExternalLink
              href="mailto:parkwooyeon.dev@gmail.com"
              label="Email"
              onNavigate={() => onOpenChange?.(false)}
            />
            <ExternalLink
              href="/feed.xml"
              label="RSS"
              onNavigate={() => onOpenChange?.(false)}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

function getDescription(id: MobileNavItem['id']) {
  switch (id) {
    case 'home':
      return '전체 피드와 최근 글';
    case 'engineering':
      return '기술 글과 시리즈';
    case 'life':
      return '에세이와 회고';
    case 'resume':
      return '경력과 프로젝트';
    default:
      return '';
  }
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
      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-grey-50)] hover:text-[var(--color-text-primary)]"
    >
      <span>{label}</span>
      <span className="text-xs text-[var(--color-grey-400)]">열기</span>
    </a>
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
