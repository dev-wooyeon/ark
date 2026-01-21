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
            <div className={styles.filters}>
                <button
                    className={`${styles.filterButton} ${activeFilter === 'Dev' ? styles.active : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'Dev' ? 'All' : 'Dev')}
                >
                    <span className={styles.checkbox}>{activeFilter === 'Dev' ? '☑' : '☐'}</span> Dev
                </button>
                <button
                    className={`${styles.filterButton} ${activeFilter === 'Life' ? styles.active : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'Life' ? 'All' : 'Life')}
                >
                    <span className={styles.checkbox}>{activeFilter === 'Life' ? '☑' : '☐'}</span> Life
                </button>
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
