'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { FeedData } from '@/types';
import FeedListItem from './FeedListItem';
import styles from './FeedList.module.css';
import { useFeedFilter, FilterType } from '@/hooks/useFeedFilter';

interface FeedListProps {
    feed: FeedData[];
}

function FeedListSkeleton() {
    return (
        <div className={styles.container}>
            <div className={styles.filterSection}>
                <span className={styles.filterLabel}>Filter:</span>
                <div className={styles.segmentedControl}>
                    {['Dev', 'Life', 'Clear'].map((filter) => (
                        <div key={filter} className={`${styles.segment} ${styles.skeletonSegment}`}>
                            {filter}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.tableHeader}>
                <div className={styles.headerDate}>Date /</div>
                <div className={styles.headerTitle}>Title /</div>
                <div className={styles.headerReadingTime}>Time /</div>
            </div>

            <div className={styles.list}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        className={styles.skeletonItem}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    >
                        <div className={styles.skeletonDate} />
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonTime} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            className={styles.empty}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
            <motion.span
                className={styles.emptyIcon}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                ∅
            </motion.span>
            <span className={styles.emptyText}>No feed found.</span>
        </motion.div>
    );
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
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

export default function FeedList(props: FeedListProps) {
    return (
        <Suspense fallback={<FeedListSkeleton />}>
            <FeedListContent {...props} />
        </Suspense>
    );
}
