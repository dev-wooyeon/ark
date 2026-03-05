import { Header } from '@/shared/layout';
import type { FeedData } from '@/domains/post/model/types';
import { getPopularViewsInRecentDays } from '@/app/actions/view';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { getSeriesSummaries } from '@/features/blog/model/series-group';
import HeroSection from '@/features/home/ui/sections/HeroSection';

const POPULAR_POST_LIMIT = 5;
const POPULAR_VIEW_DAYS = 30;

export interface HomePopularPost {
  post: FeedData;
  viewCount: number | null;
}

function buildPopularPosts(
  allPosts: FeedData[],
  popularViews: Array<{ slug: string; count: number }>
): HomePopularPost[] {
  const nonSeriesPosts = allPosts.filter((post) => !post.series);
  const postMap = new Map(nonSeriesPosts.map((post) => [post.slug, post]));
  const pickedSlugs = new Set<string>();

  const rankedMatches = popularViews
    .map<HomePopularPost | null>((entry) => {
      const post = postMap.get(entry.slug);

      if (!post) {
        return null;
      }

      return {
        post,
        viewCount: entry.count,
      };
    })
    .filter((entry): entry is HomePopularPost => entry !== null)
    .sort((a, b) => {
      const countGap = (b.viewCount ?? 0) - (a.viewCount ?? 0);
      if (countGap !== 0) {
        return countGap;
      }

      return a.post.date < b.post.date ? 1 : -1;
    });

  const result: HomePopularPost[] = [];

  for (const entry of rankedMatches) {
    if (result.length >= POPULAR_POST_LIMIT) {
      break;
    }

    if (pickedSlugs.has(entry.post.slug)) {
      continue;
    }

    pickedSlugs.add(entry.post.slug);
    result.push(entry);
  }

  if (result.length >= POPULAR_POST_LIMIT) {
    return result;
  }

  for (const post of nonSeriesPosts) {
    if (result.length >= POPULAR_POST_LIMIT) {
      break;
    }

    if (pickedSlugs.has(post.slug)) {
      continue;
    }

    pickedSlugs.add(post.slug);
    result.push({
      post,
      viewCount: null,
    });
  }

  return result;
}

export default async function HomePage() {
  const sortedPosts = getSortedFeedData();
  const seriesSummaries = getSeriesSummaries(sortedPosts);
  const popularViews = await getPopularViewsInRecentDays(
    POPULAR_VIEW_DAYS,
    POPULAR_POST_LIMIT
  );
  const popularPosts = buildPopularPosts(sortedPosts, popularViews);

  return (
    <>
      <Header />
      <main>
        <HeroSection
          allArticles={sortedPosts}
          seriesSummaries={seriesSummaries}
          popularPosts={popularPosts}
        />
      </main>
    </>
  );
}
