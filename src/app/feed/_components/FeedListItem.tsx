'use client';

import Link from 'next/link';
import { FeedData } from '@/types';
import styles from '@/styles/components.module.css';

interface FeedListItemProps {
    feed: FeedData;
}

export default function FeedListItem({ feed }: FeedListItemProps) {
    return (
        <Link href={`/feed/${feed.slug}`} className={styles.feedItem}>
            <span className={styles.feedItemDate}>{feed.date}</span>
            <h3 className={styles.feedItemTitle}>{feed.title}</h3>
            {feed.readingTime && (
                <span className={styles.feedItemReadingTime}>{feed.readingTime} min read</span>
            )}
        </Link>
    );
}
