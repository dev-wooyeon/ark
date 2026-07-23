'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { personalInfo } from '@/resume/model/resume-data';
import { SITE_FEED_PATH } from '@/site/config/site';

interface AppShellProps {
  children: ReactNode;
}

interface ExternalLinkItem {
  href: string;
  label: string;
}

const EXTERNAL_LINKS: ExternalLinkItem[] = [
  {
    href: personalInfo.github,
    label: 'GitHub',
  },
  {
    href: `mailto:${personalInfo.email}`,
    label: 'Email',
  },
  {
    href: SITE_FEED_PATH,
    label: 'RSS',
  },
];

const PRIMARY_LINKS = [
  {
    href: '/resume',
    label: 'Resume',
    isActive: (pathname: string) => pathname.startsWith('/resume'),
  },
  {
    href: '/archive',
    label: 'Archive',
    isActive: (pathname: string) =>
      pathname.startsWith('/archive') ||
      pathname.startsWith('/engineering') ||
      pathname.startsWith('/life') ||
      pathname.startsWith('/blog/'),
  },
];

function ExternalLinks() {
  return (
    <nav aria-label="Ark 외부 링크" className="ark-site-external-links">
      {EXTERNAL_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="ark-site-external-link transition-colors hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="ark-site-shell bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <div
        data-page-scroll-container
        data-page-scroll-mode="document"
        className="ark-site-grid"
      >
        <aside className="ark-site-identity">
          <header>
            <Link
              href="/"
              aria-label="ark 홈으로 이동"
              className="ark-site-brand-link transition-colors hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
            >
              ark
            </Link>
          </header>
          <ExternalLinks />
        </aside>

        <div className="ark-site-content">{children}</div>

        <nav aria-label="Ark 주요 탐색" className="ark-site-navigation">
          {PRIMARY_LINKS.map((item) => {
            const isActive = item.isActive(pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className="ark-site-primary-link transition-colors hover:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}
