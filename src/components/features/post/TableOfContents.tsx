'use client';

import { useState, useEffect } from 'react';
import { TocItem } from '@/lib/feeds';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
    tocItems: TocItem[];
    className?: string;
}

export default function TableOfContents({ tocItems, className }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [isVisible, setIsVisible] = useState(true);

    // 화면 크기에 따른 목차 표시 여부 결정
    const updateVisibility = () => {
        const contentElement = document.querySelector('article');
        if (!contentElement) return;

        const contentRect = contentElement.getBoundingClientRect();
        const tocWidth = 320; // 목차 너비 + 여백 (280px + 40px)
        const windowWidth = window.innerWidth;

        // content 영역 우측 끝 + 목차 너비가 화면 너비를 초과하면 숨김
        const shouldHide = (contentRect.right + tocWidth) > windowWidth;
        setIsVisible(!shouldHide);
    };

    // 화면 크기 변경 감지 및 목차 표시 여부 업데이트
    useEffect(() => {
        updateVisibility();

        const handleResize = () => {
            updateVisibility();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [tocItems]);

    // 헤딩에 id 추가 및 Intersection Observer 설정
    useEffect(() => {
        // 모든 헤딩에 id 추가 (순서대로 매핑)
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let tocIndex = 0;

        headings.forEach((heading) => {
            if (!heading.id && tocIndex < tocItems.length) {
                // 해당하는 tocItem의 id를 할당
                heading.id = tocItems[tocIndex].id;
                tocIndex++;
            }
        });

        // Intersection Observer로 현재 보이는 섹션 감지
        const observer = new IntersectionObserver(
            (entries) => {
                // 현재 보이는 섹션들 중 가장 위쪽에 있는 것을 찾음
                const visibleEntries = entries.filter((entry: IntersectionObserverEntry) => entry.isIntersecting);

                if (visibleEntries.length > 0) {
                    // 가장 위쪽에 있는 요소를 선택
                    const topmostEntry = visibleEntries.reduce((prev, current) =>
                        prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
                    );

                    const target = topmostEntry.target as HTMLElement;
                    if (target && target.id) {
                        setActiveId(target.id);
                    }
                }
            },
            {
                rootMargin: '-80px 0px -80% 0px', // 헤더 높이 고려
                threshold: 0.1
            }
        );

        // 모든 헤딩 요소 관찰
        tocItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [tocItems]);

    // 목차 아이템 클릭 핸들러
    const handleClick = (id: string) => {
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
        const isActive = activeId === item.id;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <li key={item.id} className={styles.tocItem}>
                <button
                    onClick={() => handleClick(item.id)}
                    className={`${styles.tocLink} ${isActive ? styles.active : ''}`}
                    style={{ paddingLeft: `${depth * 12}px` }}
                >
                    <span className={styles.tocText}>
                        {item.text}
                    </span>
                </button>
                {hasChildren && (
                    <ul className={styles.tocSubList}>
                        {item.children!.map((child) => renderTocItem(child, depth + 1))}
                    </ul>
                )}
            </li>
        );
    };

    if (tocItems.length === 0 || !isVisible) {
        return null;
    }

    return (
        <nav className={`${styles.toc} ${className || ''}`}>
            <div className={styles.tocHeader}>
                <h3 className={styles.tocTitle}>목차</h3>
            </div>
            <ul className={styles.tocList}>
                {tocItems.map((item) => renderTocItem(item))}
            </ul>
        </nav>
    );
}
