import { describe, expect, it } from 'vitest';
import { getRecommendedSearchTerms } from './search-recommendations';

describe('getRecommendedSearchTerms', () => {
  it('returns popular tags ordered by frequency', () => {
    const terms = getRecommendedSearchTerms([
      { tags: ['Redis', '회고'] },
      { tags: ['Redis', 'Flink'] },
      { tags: ['회고'] },
    ]);

    expect(terms.slice(0, 3)).toEqual(['Redis', '회고', 'Flink']);
  });

  it('falls back to section terms when posts do not have tags', () => {
    expect(getRecommendedSearchTerms([{ tags: [] }])).toEqual([
      'Tech',
      'Life',
      'Resume',
    ]);
  });

  it('trims empty tags and respects the requested limit', () => {
    expect(
      getRecommendedSearchTerms([{ tags: [' Redis ', '', 'Flink', '회고'] }], 2)
    ).toHaveLength(2);
  });
});
