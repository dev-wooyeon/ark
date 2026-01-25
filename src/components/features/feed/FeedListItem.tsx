'use client';

import Link from 'next/link';
import { FeedData } from '@/types';
import styles from './FeedListItem.module.css';

interface FeedListItemProps {
    feed: FeedData;
}

export default function FeedListItem({ feed }: FeedListItemProps) {
    return (
        <Link href={`/feed/${feed.slug}`} className={styles.item}>
            <span className={styles.date}>{feed.date}</span>
            <h3 className={styles.title}>{feed.title}</h3>
            {feed.readingTime && (
                <span className={styles.readingTime}>{feed.readingTime} min read</span>
            )}
        </Link>
    );
}
