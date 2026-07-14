import { getPopularViewsInRecentDays } from '@/blog/api/view';
import { getSortedFeedData } from '@/blog/services/post-repository';
import HomePageClient from './HomePageClient';

const POPULAR_VIEW_DAYS = 30;

export default async function HomePage() {
  const sortedPosts = getSortedFeedData();
  const popularViews = await getPopularViewsInRecentDays(
    POPULAR_VIEW_DAYS,
    Math.max(sortedPosts.length, 1)
  );

  return (
    <main className="bg-canvas">
      <HomePageClient
        posts={sortedPosts}
        popularViews={popularViews.map(({ slug, count }) => ({
          slug,
          count,
        }))}
      />
    </main>
  );
}
