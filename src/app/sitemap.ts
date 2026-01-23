import { MetadataRoute } from 'next';
import { getAllFeedSlugs } from '@/lib/feeds';

const URL = 'https://eunu.log';

export default function sitemap(): MetadataRoute.Sitemap {
    const feedSlugs = getAllFeedSlugs();

    const feeds = feedSlugs.map((slugObj) => ({
        url: `${URL}/feed/${slugObj.params.slug}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const routes = ['', '/feed', '/resume'].map((route) => ({
        url: `${URL}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
        changeFrequency: 'monthly' as const,
        priority: 1,
    }));

    return [...routes, ...feeds];
}
