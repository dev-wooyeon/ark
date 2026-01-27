'use client';

import { useState, useEffect, useCallback } from 'react';
import { TocItem } from '@/lib/mdx-feeds';
import { HEADER_OFFSET, TOC_ROOT_MARGIN } from '@/lib/constants';

interface InlineTableOfContentsProps {
    tocItems: TocItem[];
}

// TocItem 트리에서 모든 ID 추출
function getAllIds(items: TocItem[]): string[] {
    const ids: string[] = [];
    for (const item of items) {
        ids.push(item.id);
        if (item.children) {
            ids.push(...getAllIds(item.children));
        }
    }
    return ids;
}

export default function InlineTableOfContents({ tocItems }: InlineTableOfContentsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    // IntersectionObserver로 현재 보이는 섹션 추적
    useEffect(() => {
        const allIds = getAllIds(tocItems);
        if (allIds.length === 0) return;

        const observerCallback: IntersectionObserverCallback = (entries) => {
            // 화면에 보이는 헤딩 중 가장 위에 있는 것 찾기
            const visibleEntries = entries.filter(entry => entry.isIntersecting);

            if (visibleEntries.length > 0) {
                // 가장 위에 있는 헤딩 선택
                const topEntry = visibleEntries.reduce((prev, current) => {
                    return prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current;
                });
                setActiveId(topEntry.target.id);
            }
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: TOC_ROOT_MARGIN,
            threshold: 0,
        });

        // 모든 헤딩 요소 관찰
        allIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [tocItems]);

    // 목차 아이템 클릭 핸들러
    const handleClick = useCallback((id: string, e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - HEADER_OFFSET;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveId(id);
        }
    }, []);

    // 키보드 네비게이션 핸들러
    const handleKeyDown = useCallback((id: string, e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleClick(id, e);
        }
    }, [handleClick]);

    if (tocItems.length === 0) {
        return null;
    }

    // 재귀적으로 목차 아이템 렌더링
    const renderTocItem = (item: TocItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = activeId === item.id;

        return (
            <li key={item.id} className="mb-1">
                <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(item.id, e)}
                    onKeyDown={(e) => handleKeyDown(item.id, e)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`
                        block py-2 px-3 text-[var(--text-secondary)] no-underline rounded-sm
                        transition-all duration-200 text-sm leading-relaxed
                        hover:bg-[var(--accent-tertiary)] hover:text-[var(--accent-primary)]
                        focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] focus-visible:outline-offset-2
                        ${isActive ? 'text-[var(--accent-primary)] font-medium relative before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[60%] before:bg-[var(--accent-primary)] before:rounded-sm' : ''}
                    `}
                    style={{ paddingLeft: `${depth * 16 + 12}px` }}
                >
                    {item.text}
                </a>
                {hasChildren && (
                    <ul className="list-none p-0 my-1" role="list">
                        {item.children!.map((child) => renderTocItem(child, depth + 1))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <nav
            className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg mb-8 overflow-hidden"
            aria-label="목차"
        >
            <button
                className="w-full flex items-center gap-2 p-4 bg-transparent border-none cursor-pointer text-base text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--accent-tertiary)] focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] focus-visible:outline-offset-[-2px]"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls="toc-list"
            >
                <span
                    className={`text-xs text-[var(--text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-0' : ''}`}
                    aria-hidden="true"
                >
                    {isExpanded ? '▼' : '▶'}
                </span>
                <span className="font-semibold">목차</span>
                <span className="text-sm text-[var(--text-tertiary)]" aria-label={`총 ${tocItems.length}개 항목`}>
                    ({tocItems.length})
                </span>
            </button>

            {isExpanded && (
                <ul
                    id="toc-list"
                    className="list-none p-4 pt-0 m-0 border-t border-[var(--border)]"
                    role="list"
                >
                    {tocItems.map((item) => renderTocItem(item))}
                </ul>
            )}
        </nav>
    );
}
