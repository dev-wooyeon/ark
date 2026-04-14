import { describe, expect, it } from 'vitest';
import { FeedFrontmatterSchema } from './frontmatter-schema';

describe('FeedFrontmatterSchema', () => {
  it('defaults visibility to public', () => {
    const parsed = FeedFrontmatterSchema.parse({
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech',
    });

    expect(parsed.visibility).toBe('public');
  });

  it('accepts empty quality review scaffolds', () => {
    const parsed = FeedFrontmatterSchema.parse({
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech',
      qualityReview: {
        philosophy: null,
        design: null,
        implementation: null,
        brandFit: null,
      },
    });

    expect(parsed.qualityReview?.philosophy).toBeNull();
  });

  it('rejects scores outside the allowed range or increment', () => {
    const baseInput = {
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech' as const,
    };

    expect(() =>
      FeedFrontmatterSchema.parse({
        ...baseInput,
        qualityReview: {
          philosophy: 3.3,
        },
      })
    ).toThrow(/0\.5 increments/);

    expect(() =>
      FeedFrontmatterSchema.parse({
        ...baseInput,
        qualityReview: {
          philosophy: 5.5,
        },
      })
    ).toThrow();
  });
});
