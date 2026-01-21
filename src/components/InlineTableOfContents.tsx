'use client';

import { useState } from 'react';
import { TocItem } from '@/lib/feeds';
import styles from './InlineTableOfContents.module.css';

interface InlineTableOfContentsProps {
    tocItems: TocItem[];
}

export default function InlineTableOfContents({ tocItems }: InlineTableOfContentsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (tocItems.length === 0) {
        return null;
    }

    // 목차 아이템 클릭 핸들러
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80; // 헤더 높이 + 여백
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // 재귀적으로 목차 아이템 렌더링
    const renderTocItem = (item: TocItem, depth = 0) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
            <li key={item.id} className={styles.tocItem}>
                <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(item.id, e)}
                    className={styles.tocLink}
                    style={{ paddingLeft: `${depth * 16}px` }}
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
