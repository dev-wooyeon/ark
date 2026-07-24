'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0 || !portalRoot) return null;

  return createPortal(
    <nav
      className="fixed right-8 top-20 bottom-8 hidden w-64 xl:block"
      aria-label="이 글의 목차"
    >
      <div className="h-full overflow-y-auto rounded-[var(--radius-md)] bg-[var(--color-grey-50)] p-4">
        <h2 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4 sticky top-0 bg-[var(--color-grey-50)] pb-2">
          이 글의 목차
        </h2>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? 'location' : undefined}
                className={clsx(
                  'block w-full text-left text-sm py-1.5 px-3 rounded-[6px]',
                  'transition-colors duration-[var(--duration-150)]',
                  item.level > 2 && 'pl-6',
                  activeId === item.id
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]'
                )}
                style={{ fontFamily: 'var(--font-sans-emoji)' }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>,
    portalRoot
  );
}

export type { TableOfContentsProps, TocItem };
