import { getPopularViewsInRecentDays } from '@/app/actions/view';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import HomePageClient from './HomePageClient';

const POPULAR_VIEW_DAYS = 30;

export default async function HomePage() {
  const sortedPosts = getSortedFeedData();
  const popularViews = await getPopularViewsInRecentDays(
    POPULAR_VIEW_DAYS,
    Math.max(sortedPosts.length, 1)
  );

  return (
    <main>
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
