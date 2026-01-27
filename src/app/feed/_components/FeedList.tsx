'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { FeedData } from '@/types';
import FeedListItem from './FeedListItem';
import { useFeedFilter, FilterType } from '../_hooks/useFeedFilter';
import Button from '@/app/_components/Button';

interface FeedListProps {
    feed: FeedData[];
}

function FeedListSkeleton() {
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 max-md:gap-3">
                <span className="text-sm font-medium text-[var(--text-tertiary)] max-md:text-xs">Filter:</span>
                <div className="inline-flex bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-0.5 gap-0.5">
                    {['Dev', 'Life', 'Clear'].map((filter) => (
                        <div
                            key={filter}
                            className="bg-transparent border-none font-sans text-sm font-semibold text-[var(--text-primary)] py-2 px-4 rounded-md whitespace-nowrap opacity-50 pointer-events-none max-md:text-xs max-md:py-1 max-md:px-3"
                        >
                            {filter}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-[120px_1fr_100px] items-center gap-4 py-4 bg-[var(--bg-primary)] border-b-2 border-[var(--border)] font-semibold text-sm text-[var(--text-primary)] mb-2 max-md:hidden">
                <div className="font-mono text-sm text-[var(--text-tertiary)]">Date /</div>
                <div className="font-mono text-sm text-[var(--text-tertiary)]">Title /</div>
                <div className="font-mono text-sm text-[var(--text-tertiary)] text-right">Time /</div>
            </div>

            <div className="flex flex-col w-full">
                {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                        key={i}
                        className="grid grid-cols-[120px_1fr_100px] items-center gap-4 py-4 border-b border-[var(--border)] max-md:grid-cols-1 max-md:gap-2"
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    >
                        <div className="h-3.5 w-20 bg-[var(--text-tertiary)] opacity-15 rounded" />
                        <div className="h-5 w-3/5 bg-[var(--text-tertiary)] opacity-15 rounded max-md:order-first max-md:w-4/5" />
                        <div className="h-3 w-15 bg-[var(--text-tertiary)] opacity-15 rounded ml-auto max-md:ml-0" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <motion.div
            className="flex flex-col items-center gap-3 py-16 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
            <motion.span
                className="text-2xl text-[var(--text-tertiary)] opacity-50"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                ∅
            </motion.span>
            <span className="font-mono text-sm text-[var(--text-tertiary)]">No feed found.</span>
        </motion.div>
    );
}

function FeedListContent({ feed }: FeedListProps) {
    const { activeFilter, setActiveFilter, filteredFeed } = useFeedFilter(feed);

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 max-md:gap-3">
                <span className="text-sm font-medium text-text-tertiary max-md:text-xs">Filter:</span>
                <div className="inline-flex bg-primary border border-border rounded-lg p-0.5 gap-0.5">
                    {(['Dev', 'Life'] as FilterType[]).map((filter) => (
                        <Button
                            key={filter}
                            variant={activeFilter === filter ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveFilter(filter)}
                            className="max-md:text-xs max-md:py-1 max-md:px-3"
                        >
                            {filter}
                        </Button>
                    ))}
                    <Button
                        variant={activeFilter === 'All' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter('All')}
                        className="max-md:text-xs max-md:py-1 max-md:px-3"
                    >
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-[120px_1fr_100px] items-center gap-4 py-4 bg-primary border-b-2 border-border font-semibold text-sm text-text-primary mb-2 max-md:hidden">
                <div className="font-mono text-sm text-text-tertiary">Date /</div>
                <div className="font-mono text-sm text-text-tertiary">Title /</div>
                <div className="font-mono text-sm text-text-tertiary text-right">Time /</div>
            </div>

            <div className="flex flex-col w-full">
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
