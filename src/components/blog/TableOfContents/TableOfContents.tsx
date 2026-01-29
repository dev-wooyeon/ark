'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
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

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Update URL hash without jumping and without adding to history
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav
      className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 w-64"
      aria-label="목차"
    >
      <div className="p-4 bg-[var(--color-grey-50)] rounded-[var(--radius-md)]">
        <h2 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4">
          목차
        </h2>
        <ul className="flex flex-col gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={clsx(
                  'block w-full text-left text-sm py-1.5 px-3 rounded-[6px]',
                  'transition-colors duration-[var(--duration-150)]',
                  item.level > 2 && 'pl-6',
                  activeId === item.id
                    ? 'bg-[var(--color-toss-blue)]/10 text-[var(--color-toss-blue)] font-medium'
                    : 'text-[var(--color-grey-600)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)]'
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export type { TableOfContentsProps, TocItem };
