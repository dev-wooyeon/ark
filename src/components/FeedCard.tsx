'use client';

import Link from 'next/link';
import { FeedData } from '@/types';
import styles from './FeedCard.module.css';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

interface FeedCardProps {
    feed: FeedData;
}

export default function FeedCard({ feed }: FeedCardProps) {
    return (
        <MotionLink
            href={`/feed/${feed.slug}`}
            className={styles.card}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className={styles.category}>{feed.category}</div>
            <h3 className={styles.title}>{feed.title}</h3>
            <p className={styles.description}>{feed.description}</p>
            <div className={styles.footer}>
                <span className={styles.date}>{feed.date}</span>
                {feed.readingTime && (
                    <span className={styles.readingTime}>{feed.readingTime} min read</span>
                )}
            </div>
        </MotionLink>
    );
}
