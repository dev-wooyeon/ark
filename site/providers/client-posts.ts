import type { FeedData } from '@/blog/model/types';
import type { SearchablePost } from '@/search/model/get-search-actions';

export function selectClientPosts(posts: FeedData[]): SearchablePost[] {
  return posts.map(({ slug, title, description, category, tags }) => ({
    slug,
    title,
    description,
    category,
    tags,
  }));
}
