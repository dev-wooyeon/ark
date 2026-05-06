import type { FeedData } from '@/domains/post/model/types';

type SearchRecommendationSource = Pick<FeedData, 'tags'>;

const FALLBACK_RECOMMENDATIONS = ['Tech', 'Life', 'Resume'];

export function getRecommendedSearchTerms(
  posts: SearchRecommendationSource[],
  limit = 5
): string[] {
  const counts = new Map<string, number>();
  const firstSeenIndexes = new Map<string, number>();
  let nextIndex = 0;

  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const term = tag.trim();

      if (term.length === 0) {
        return;
      }

      if (!firstSeenIndexes.has(term)) {
        firstSeenIndexes.set(term, nextIndex);
        nextIndex += 1;
      }

      counts.set(term, (counts.get(term) ?? 0) + 1);
    });
  });

  const recommendations = Array.from(counts.entries())
    .sort(([leftTerm, leftCount], [rightTerm, rightCount]) => {
      if (leftCount !== rightCount) {
        return rightCount - leftCount;
      }

      return (
        (firstSeenIndexes.get(leftTerm) ?? 0) -
        (firstSeenIndexes.get(rightTerm) ?? 0)
      );
    })
    .map(([term]) => term)
    .slice(0, limit);

  return recommendations.length > 0
    ? recommendations
    : FALLBACK_RECOMMENDATIONS.slice(0, limit);
}
