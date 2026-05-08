import { MetadataRoute } from 'next';
import { getSortedFeedData } from '@/blog/services/post-repository';
import { SITE_FEED_PATH, SITE_URL } from '@/site/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const feeds = getSortedFeedData();

  const feedEntries = feeds.map((feed) => ({
    url: `${SITE_URL}/blog/${feed.slug}`,
    lastModified: feed.date, // Use actual post date
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routes = ['', '/engineering', '/life', '/resume', SITE_FEED_PATH].map(
    (route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency:
        route === SITE_FEED_PATH ? ('daily' as const) : ('monthly' as const),
      priority: 1,
    })
  );

  return [...routes, ...feedEntries];
}
