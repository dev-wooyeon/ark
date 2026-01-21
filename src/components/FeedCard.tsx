'use client';

import Link from 'next/link';
import { FeedData } from '@/types';
import styles from './FeedCard.module.css';

interface FeedCardProps {
    feed: FeedData;
}

export default function FeedCard({ feed }: FeedCardProps) {
    return (
        <Link href={`/feed/${feed.slug}`} className={styles.card}>
            <div className={styles.category}>{feed.category}</div>
            <h3 className={styles.title}>{feed.title}</h3>
            <p className={styles.description}>{feed.description}</p>
            <div className={styles.footer}>
                <span className={styles.date}>{feed.date}</span>
                {feed.readingTime && (
                    <span className={styles.readingTime}>{feed.readingTime} min read</span>
                )}
            </div>
        </Link>
    );
}
