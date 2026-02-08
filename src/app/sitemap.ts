import { MetadataRoute } from 'next';
import { getSortedFeedData } from '@/lib/mdx-feeds';

const URL = 'https://eunu-log.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const feeds = getSortedFeedData();

  const feedEntries = feeds.map((feed) => ({
    url: `${URL}/blog/${feed.slug}`,
    lastModified: feed.date, // Use actual post date
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/blog', '/resume', '/feed.xml'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency:
      route === '/feed.xml' ? ('daily' as const) : ('monthly' as const),
    priority: 1,
  }));

  return [...routes, ...feedEntries];
}
