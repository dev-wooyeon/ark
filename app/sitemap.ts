import { MetadataRoute } from 'next';
import { getSeriesSummaries } from '@/blog/model/series-group';
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

  const seriesEntries = getSeriesSummaries(
    feeds.filter((feed) => feed.category === 'Tech')
  ).map((series) => ({
    url: createSiteUrl(`/engineering/series/${encodeURIComponent(series.id)}`),
    lastModified: series.latestDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const routePaths: SitePath[] = [
    '',
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

  return [...routes, ...seriesEntries, ...feedEntries];
}
