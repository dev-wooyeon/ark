import type { FeedData } from '@/blog/model/types';

export interface PublicationQueryOptions {
  includePrivate?: boolean;
}

export function isPostVisible(
  post: Pick<FeedData, 'visibility'>,
  options: PublicationQueryOptions = {}
): boolean {
  return options.includePrivate || post.visibility === 'public';
}

export function filterVisiblePosts<T extends Pick<FeedData, 'visibility'>>(
  posts: T[],
  options: PublicationQueryOptions = {}
): T[] {
  return posts.filter((post) => isPostVisible(post, options));
}
