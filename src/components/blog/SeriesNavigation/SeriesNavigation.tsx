'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FeedData } from '@/types';
import styles from './SeriesNavigation.module.css';

interface SeriesNavigationProps {
    currentSlug: string;
    seriesTitle: string;
    seriesPosts: FeedData[];
    currentOrder: number;
}

export default function SeriesNavigation({
    currentSlug,
    seriesTitle,
    seriesPosts,
    currentOrder,
}: SeriesNavigationProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const prevPost = seriesPosts.find(p => p.series?.order === currentOrder - 1);
    const nextPost = seriesPosts.find(p => p.series?.order === currentOrder + 1);

    return (
        <div className={styles.container}>
            <button
                className={styles.header}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <div className={styles.headerContent}>
                    <span className={styles.seriesLabel}>시리즈</span>
                    <span className={styles.seriesTitle}>{seriesTitle}</span>
                    <span className={styles.count}>
                        {currentOrder} / {seriesPosts.length}
                    </span>
                </div>
                <svg
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isExpanded && (
                <div className={styles.content}>
                    <ol className={styles.list}>
                        {seriesPosts.map((post) => (
                            <li
                                key={post.slug}
                                className={`${styles.item} ${post.slug === currentSlug ? styles.itemActive : ''}`}
                            >
                                {post.slug === currentSlug ? (
                                    <span className={styles.current}>
                                        <span className={styles.order}>{post.series?.order}.</span>
                                        {post.title}
                                    </span>
                                ) : (
                                    <Link href={`/blog/${post.slug}`} className={styles.link}>
                                        <span className={styles.order}>{post.series?.order}.</span>
                                        {post.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>

                    <div className={styles.navigation}>
                        {prevPost ? (
                            <Link href={`/blog/${prevPost.slug}`} className={styles.navLink}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className={styles.navText}>
                                    <span className={styles.navLabel}>이전 글</span>
                                    <span className={styles.navTitle}>{prevPost.title}</span>
                                </span>
                            </Link>
                        ) : (
                            <div />
                        )}
                        {nextPost ? (
                            <Link href={`/blog/${nextPost.slug}`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                                <span className={styles.navText}>
                                    <span className={styles.navLabel}>다음 글</span>
                                    <span className={styles.navTitle}>{nextPost.title}</span>
                                </span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
