import Link from 'next/link';
import { FeedData } from '@/types';

interface FeedListItemProps {
    feed: FeedData;
}

export default function FeedListItem({ feed }: FeedListItemProps) {
    return (
        <Link
            href={`/feed/${feed.slug}`}
            className="
                grid grid-cols-[120px_1fr_100px] items-center gap-4
                py-4 px-3 -mx-3
                border-b border-border border-l-2 border-l-transparent
                rounded-sm no-underline
                transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]
                text-inherit relative
                hover:bg-accent-tertiary hover:border-l-accent hover:translate-x-1
                max-md:grid-cols-1 max-md:gap-1 max-md:items-start max-md:hover:translate-x-0.5
                group
            "
        >
            <span className="font-mono text-sm text-text-tertiary group-hover:text-text-secondary max-md:text-xs max-md:order-1">
                {feed.date}
            </span>
            <h3 className="font-sans text-lg font-semibold text-text-primary m-0 overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-200 group-hover:text-accent max-md:text-base max-md:whitespace-normal max-md:order-first">
                {feed.title}
            </h3>
            {feed.readingTime && (
                <span className="font-mono text-xs text-text-tertiary text-right group-hover:text-text-secondary max-md:text-left max-md:order-2">
                    {feed.readingTime} min read
                </span>
            )}
        </Link>
    );
}
