'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/lib/feeds';
import styles from './InlineTableOfContents.module.css';

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
            rootMargin: '-80px 0px -70% 0px', // 헤더 높이 고려, 상단 30% 영역에서 감지
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

    if (tocItems.length === 0) {
        return null;
    }

    // 목차 아이템 클릭 핸들러
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80; // 헤더 높이 + 여백
            // getBoundingClientRect()를 사용하여 정확한 위치 계산
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setActiveId(id); // 클릭시 즉시 활성화
        }
    };

    // 재귀적으로 목차 아이템 렌더링
    const renderTocItem = (item: TocItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = activeId === item.id;

        return (
            <li key={item.id} className={styles.tocItem}>
                <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(item.id, e)}
                    className={`${styles.tocLink} ${isActive ? styles.active : ''}`}
                    style={{ paddingLeft: `${depth * 16 + 12}px` }}
                >
                    {item.text}
                </a>
                {hasChildren && (
                    <ul className={styles.tocSubList}>
                        {item.children!.map((child) => renderTocItem(child, depth + 1))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <nav className={styles.inlineToc}>
            <button
                className={styles.tocToggle}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <span className={styles.tocIcon}>
                    {isExpanded ? '▼' : '▶'}
                </span>
                <span className={styles.tocTitle}>목차</span>
                <span className={styles.tocCount}>({tocItems.length})</span>
            </button>

            {isExpanded && (
                <ul className={styles.tocList}>
                    {tocItems.map((item) => renderTocItem(item))}
                </ul>
            )}
        </nav>
    );
}
