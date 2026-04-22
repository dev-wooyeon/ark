import { describe, expect, it } from 'vitest';
import type { FeedData, QualityReview } from '@/domains/post/model/types';
import { getSortedFeedData } from './post-repository';

const FEATURED_SLUGS = [
  'ctr-pipeline',
  'db-outage-analysis-retrospective',
  'payment-system-design',
  'settlement-automation',
  'msa-domain-workspace-submodule',
];

function readCoreAverage(review: QualityReview | undefined): number | null {
  const scores = [
    review?.philosophy,
    review?.design,
    review?.implementation,
  ];

  if (scores.some((score) => typeof score !== 'number')) {
    return null;
  }

  const [philosophy, design, implementation] = scores as number[];
  return (philosophy + design + implementation) / 3;
}

function describePost(post: FeedData): string {
  return `${post.slug} (${post.title})`;
}

describe('publication policy', () => {
  it('keeps all series posts private', () => {
    const publicSeriesPosts = getSortedFeedData().filter((post) => post.series);

    expect(publicSeriesPosts).toEqual([]);
  });

  it('requires public tech posts to stay above the minimum review threshold', () => {
    const offenses = getSortedFeedData()
      .filter((post) => post.category === 'Tech')
      .flatMap((post) => {
        const average = readCoreAverage(post.qualityReview);

        if (average === null) {
          return [`${describePost(post)}: qualityReview core scores are incomplete`];
        }

        if (average <= 3) {
          return [`${describePost(post)}: core average ${average.toFixed(2)} <= 3.0`];
        }

        return [];
      });

    expect(offenses).toEqual([]);
  });

  it('requires featured posts to meet branding thresholds', () => {
    const featuredPosts = getSortedFeedData().filter((post) => post.featured);
    const offenses = featuredPosts
      .flatMap((post) => {
        const brandFit = post.qualityReview?.brandFit;
        const currentOffenses: string[] = [];

        if (post.category !== 'Tech') {
          currentOffenses.push(`${describePost(post)}: featured posts must be Tech`);
        }

        if (post.series) {
          currentOffenses.push(`${describePost(post)}: featured posts must not be series`);
        }

        if (typeof brandFit !== 'number' || brandFit < 4) {
          currentOffenses.push(
            `${describePost(post)}: brandFit must be >= 4.0`
          );
        }

        return currentOffenses;
      });

    expect(featuredPosts.map((post) => post.slug).sort()).toEqual(
      [...FEATURED_SLUGS].sort()
    );
    expect(offenses).toEqual([]);
  });
});
