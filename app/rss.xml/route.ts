import { getSortedFeedData } from '@/blog/services/post-repository';
import { createRssFeed } from '@/blog/services/rss-feed';
import {
  SITE_DESCRIPTION,
  SITE_FEED_URL,
  SITE_NAME,
  SITE_URL,
} from '@/site/config/site';

export async function GET() {
  const allPosts = getSortedFeedData();
  const rss = createRssFeed({
    posts: allPosts,
    siteUrl: SITE_URL,
    siteName: SITE_NAME,
    siteDescription: SITE_DESCRIPTION,
    feedUrl: SITE_FEED_URL,
  });

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  });
}
