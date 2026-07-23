// @vitest-environment node

import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import { getAllFeedSlugs, getSortedFeedData } from './post-repository';
import {
  filterListedPosts,
  filterVisiblePosts,
  getCoreTechReviewAverage,
  isEligibleForFeaturedPost,
  isListedPost,
  isPostVisible,
  meetsPublicTechReviewThreshold,
  PUBLICATION_POLICY,
} from './policy';

const FEATURED_SLUGS = [
  'ctr-pipeline',
  'db-outage-analysis-retrospective',
  'llm-wiki-build-retrospective',
  'msa-domain-workspace-submodule',
];

function describePost(post: FeedData): string {
  return `${post.slug} (${post.title})`;
}

describe('publication policy', () => {
  it('keeps private posts hidden unless a caller explicitly requests a preview', () => {
    const unspecifiedPost = {};
    const privatePost = { visibility: 'private' };
    const publicPost = { visibility: 'public' };

    expect(isPostVisible(unspecifiedPost)).toBe(false);
    expect(isPostVisible(privatePost)).toBe(false);
    expect(isPostVisible(publicPost)).toBe(true);
    expect(isPostVisible(privatePost, { includePrivate: true })).toBe(true);
    expect(filterVisiblePosts([privatePost, publicPost])).toEqual([publicPost]);
  });

  it('keeps editorial thresholds in the policy module', () => {
    expect(
      meetsPublicTechReviewThreshold({
        philosophy: 3.5,
        design: 3.5,
        implementation: 3.5,
      })
    ).toBe(true);
    expect(meetsPublicTechReviewThreshold({})).toBe(false);

    expect(
      isEligibleForFeaturedPost({
        category: 'Tech',
        qualityReview: {
          brandFit: PUBLICATION_POLICY.featured.minimumBrandFit,
        },
      })
    ).toBe(true);
    expect(
      isEligibleForFeaturedPost({
        category: 'Life',
        qualityReview: {
          brandFit: PUBLICATION_POLICY.featured.minimumBrandFit,
        },
      })
    ).toBe(false);
  });

  it('excludes public tech posts that fail review thresholds from public listings', () => {
    const belowThresholdPost: FeedData = {
      title: 'Below threshold',
      slug: 'below-threshold',
      description: 'desc',
      date: '2026-01-01',
      category: 'Tech',
      contentType: 'essay',
      visibility: 'public',
      qualityReview: {
        philosophy: 2,
        design: 2,
        implementation: 2,
      },
    };

    expect(isListedPost(belowThresholdPost)).toBe(false);
    expect(isListedPost(belowThresholdPost, { includePrivate: true })).toBe(
      true
    );
    expect(filterListedPosts([belowThresholdPost])).toEqual([]);
  });

  it('keeps every private post out of public listings and static paths', () => {
    const allPosts = getSortedFeedData({ includePrivate: true });
    const privatePosts = allPosts.filter(
      (post) => post.visibility === 'private'
    );
    const publicSlugs = new Set(getSortedFeedData().map((post) => post.slug));
    const staticSlugs = new Set(getAllFeedSlugs().map((item) => item.slug));

    expect(privatePosts.length).toBeGreaterThan(0);
    for (const post of privatePosts) {
      expect(publicSlugs.has(post.slug), `${post.slug} leaked to listing`).toBe(
        false
      );
      expect(
        staticSlugs.has(post.slug),
        `${post.slug} leaked to static params`
      ).toBe(false);
    }
  });

  it('keeps all series posts private', () => {
    const publicSeriesPosts = getSortedFeedData().filter((post) => post.series);

    expect(publicSeriesPosts).toEqual([]);
  });

  it('requires public tech posts to stay above the minimum review threshold', () => {
    const offenses = getSortedFeedData()
      .filter((post) => post.category === 'Tech')
      .flatMap((post) => {
        const average = getCoreTechReviewAverage(post.qualityReview);

        if (!meetsPublicTechReviewThreshold(post.qualityReview)) {
          if (average === null) {
            return [
              `${describePost(post)}: qualityReview core scores are incomplete`,
            ];
          }

          return [
            `${describePost(post)}: core average ${average.toFixed(2)} <= ${PUBLICATION_POLICY.publicTech.minimumCoreReviewAverageExclusive.toFixed(1)}`,
          ];
        }

        return [];
      });

    expect(offenses).toEqual([]);
  });

  it('requires featured posts to meet branding thresholds', () => {
    const featuredPosts = getSortedFeedData().filter((post) => post.featured);
    const offenses = featuredPosts.flatMap((post) => {
      return isEligibleForFeaturedPost(post)
        ? []
        : [`${describePost(post)}: does not meet featured criteria`];
    });

    expect(featuredPosts.map((post) => post.slug).sort()).toEqual(
      [...FEATURED_SLUGS].sort()
    );
    expect(offenses).toEqual([]);
  });
});
