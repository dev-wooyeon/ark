import type { FeedData, QualityReview } from '@/blog/model/types';

export const PUBLICATION_POLICY = {
  publicTech: {
    minimumCoreReviewAverageExclusive: 3,
  },
  featured: {
    category: 'Tech',
    minimumBrandFit: 4,
  },
} as const;

const CORE_TECH_REVIEW_FIELDS = [
  'philosophy',
  'design',
  'implementation',
] as const;

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

export function getCoreTechReviewAverage(
  review: QualityReview | undefined
): number | null {
  const scores = CORE_TECH_REVIEW_FIELDS.map((field) => review?.[field]);
  const numericScores = scores.filter(
    (score): score is number => typeof score === 'number'
  );

  if (numericScores.length !== CORE_TECH_REVIEW_FIELDS.length) {
    return null;
  }

  return (
    numericScores.reduce((sum, score) => sum + score, 0) / numericScores.length
  );
}

export function meetsPublicTechReviewThreshold(
  review: QualityReview | undefined
): boolean {
  const average = getCoreTechReviewAverage(review);

  return (
    average !== null &&
    average > PUBLICATION_POLICY.publicTech.minimumCoreReviewAverageExclusive
  );
}

export function isEligibleForFeaturedPost(
  post: Pick<FeedData, 'category' | 'qualityReview' | 'series'>
): boolean {
  const brandFit = post.qualityReview?.brandFit;

  return (
    post.category === PUBLICATION_POLICY.featured.category &&
    !post.series &&
    typeof brandFit === 'number' &&
    brandFit >= PUBLICATION_POLICY.featured.minimumBrandFit
  );
}
