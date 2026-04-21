import type { FeedData } from '@/domains/post/model/types';
import type { Category } from '@/features/blog/ui/components/CategoryFilter';

export interface HomePopularView {
  slug: string;
  count: number;
}

export type HomeSortOrder = 'latest' | 'popular';

interface HomeFeedOptions {
  query: string;
  category: Category;
  sortOrder: HomeSortOrder;
}

export function buildHomeCategoryCounts(
  posts: FeedData[]
): Record<Category, number> {
  return {
    All: posts.length,
    Tech: posts.filter((post) => post.category === 'Tech').length,
    Life: posts.filter((post) => post.category === 'Life').length,
  };
}

function buildSearchText(post: FeedData): string {
  return [
    post.title,
    post.description,
    post.category,
    post.series?.title,
    ...(post.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function compareByDateDesc(a: FeedData, b: FeedData): number {
  if (a.date === b.date) {
    return a.slug.localeCompare(b.slug);
  }

  return a.date < b.date ? 1 : -1;
}

export function filterHomePosts(
  posts: FeedData[],
  popularViews: HomePopularView[],
  { query, category, sortOrder }: HomeFeedOptions
): FeedData[] {
  const normalizedQuery = query.trim().toLowerCase();
  const popularCountBySlug = new Map(
    popularViews.map((entry) => [entry.slug, entry.count])
  );

  return [...posts]
    .filter((post) => {
      if (category !== 'All' && post.category !== category) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return buildSearchText(post).includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortOrder === 'popular') {
        const countGap =
          (popularCountBySlug.get(right.slug) ?? 0) -
          (popularCountBySlug.get(left.slug) ?? 0);

        if (countGap !== 0) {
          return countGap;
        }
      }

      return compareByDateDesc(left, right);
    });
}
