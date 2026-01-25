import { MetadataRoute } from 'next';
import { getSortedFeedData } from '@/lib/feeds';

const URL = 'https://eunu.log';

export default function sitemap(): MetadataRoute.Sitemap {
    const feeds = getSortedFeedData();

    const feedEntries = feeds.map((feed) => ({
        url: `${URL}/feed/${feed.slug}`,
        lastModified: feed.date, // Use actual post date
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const routes = ['', '/feed', '/resume'].map((route) => ({
        url: `${URL}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));

    return [...routes, ...feedEntries];
}
