'use client';

import { Suspense } from 'react';
import { FeedData } from '@/types';
import FeedListItem from './FeedListItem';
import styles from './FeedList.module.css';
import { useFeedFilter, FilterType } from '@/hooks/useFeedFilter';

interface FeedListProps {
    feed: FeedData[];
}

function FeedListContent({ feed }: FeedListProps) {
    const { activeFilter, setActiveFilter, filteredFeed } = useFeedFilter(feed);

    return (
        <div className={styles.container}>
            <div className={styles.filterSection}>
                <span className={styles.filterLabel}>Filter:</span>
                <div className={styles.segmentedControl}>
                    {(['Dev', 'Life'] as FilterType[]).map((filter) => (
                        <button
                            key={filter}
                            className={`${styles.segment} ${activeFilter === filter ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                    <button
                        className={`${styles.segment} ${activeFilter === 'All' ? styles.active : ''}`}
                        onClick={() => setActiveFilter('All')}
                    >
                        Clear
                    </button>
                </div>
            </div>


            <div className={styles.tableHeader}>
                <div className={styles.headerDate}>
                    Date /
                </div>
                <div className={styles.headerTitle}>
                    Title /
                </div>
                <div className={styles.headerReadingTime}>
                    Time /
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

export default function FeedList(props: FeedListProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FeedListContent {...props} />
        </Suspense>
    );
}

