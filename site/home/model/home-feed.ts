import type { FeedData } from '@/blog/model/types';
import type { Category } from '@/blog/ui/components/CategoryFilter';

export function buildHomeCategoryCounts(
  posts: FeedData[]
): Record<Category, number> {
  return {
    All: posts.length,
    Tech: posts.filter((post) => post.category === 'Tech').length,
    Life: posts.filter((post) => post.category === 'Life').length,
  };
}

export function filterHomePosts(
  posts: FeedData[],
  category: Category
): FeedData[] {
  return posts.filter(
    (post) => category === 'All' || post.category === category
  );
}
