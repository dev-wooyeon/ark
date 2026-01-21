'use client';

import { useState } from 'react';
import { FeedData } from '@/types';
import FeedListItem from './FeedListItem';
import styles from './FeedList.module.css';

interface FeedListProps {
    feed: FeedData[];
}

type FilterType = 'All' | 'Dev' | 'Life';

export default function FeedList({ feed }: FeedListProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');

    const filteredFeed = feed.filter((feed) => {
        if (activeFilter === 'All') return true;
        // Filter by category (case-insensitive)
        return feed.category?.toLowerCase() === activeFilter.toLowerCase();
    });

    return (
        <div className={styles.container}>
            <div className={styles.filterSection}>
                <span className={styles.filterLabel}>Filter:</span>
                <div className={styles.segmentedControl}>
                    <button
                        className={`${styles.segment} ${activeFilter === 'Dev' ? styles.active : ''}`}
                        onClick={() => setActiveFilter('Dev')}
                    >
                        Dev
                    </button>
                    <button
                        className={`${styles.segment} ${activeFilter === 'Life' ? styles.active : ''}`}
                        onClick={() => setActiveFilter('Life')}
                    >
                        Life
                    </button>
                    <button
                        className={styles.segment}
                        onClick={() => setActiveFilter('All')}
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className={styles.list}>
                {filteredFeed.length > 0 ? (
                    filteredFeed.map((feed) => (
                        <FeedListItem key={feed.slug} feed={feed} />
                    ))
                ) : (
                    <div className={styles.empty}>No feed found.</div>
                )}
            </div>
        </div>
    );
}
