import { MetadataRoute } from 'next';
import { getSortedFeedData } from '@/blog/services/post-repository';
import {
  SITE_FEED_PATH,
  createSiteUrl,
  type SitePath,
} from '@/site/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const feeds = getSortedFeedData();

  const feedEntries = feeds.map((feed) => ({
    url: createSiteUrl(`/blog/${feed.slug}`),
    lastModified: feed.updated ?? feed.date,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const routePaths: SitePath[] = [
    '',
    '/archive',
    '/engineering',
    '/life',
    '/resume',
    SITE_FEED_PATH,
  ];

  const routes = routePaths.map((route) => ({
    url: createSiteUrl(route),
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency:
      route === SITE_FEED_PATH ? ('daily' as const) : ('monthly' as const),
    priority: 1,
  }));

  return [...routes, ...feedEntries];
}
