'use client';

import { useEffect, useState } from 'react';

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

  if (items.length < 2) return null;

  return (
    <nav className="ark-article-toc" aria-label="이 글의 목차">
      <p className="ark-article-toc-title">목차</p>
      <ol className="ark-article-toc-list">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={activeId === item.id ? 'location' : undefined}
              className={[
                'ark-article-toc-link',
                item.level === 3 && 'ark-article-toc-link-level-3',
                item.level > 3 && 'ark-article-toc-link-level-4',
                activeId === item.id && 'ark-article-toc-link-active',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span aria-hidden="true" className="ark-article-toc-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type { TableOfContentsProps, TocItem };
