import { describe, expect, it } from 'vitest';
import { FeedFrontmatterSchema } from './frontmatter-schema';

describe('FeedFrontmatterSchema', () => {
  it('defaults visibility to private', () => {
    const parsed = FeedFrontmatterSchema.parse({
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech',
      contentType: 'essay',
    });

    expect(parsed.visibility).toBe('private');
  });

  it('requires content type classification', () => {
    expect(() =>
      FeedFrontmatterSchema.parse({
        title: 'Example',
        slug: 'example',
        description: 'desc',
        date: '2026-04-13',
        category: 'Tech',
      })
    ).toThrow();
  });

  it('accepts empty quality review scaffolds', () => {
    const parsed = FeedFrontmatterSchema.parse({
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech',
      contentType: 'essay',
      qualityReview: {
        philosophy: null,
        design: null,
        implementation: null,
        brandFit: null,
        clarity: null,
        structure: null,
        evidence: null,
        usefulness: null,
        originality: null,
        polish: null,
      },
    });

    expect(parsed.qualityReview?.philosophy).toBeNull();
    expect(parsed.qualityReview?.clarity).toBeNull();
  });

  it('accepts supported content types', () => {
    const baseInput = {
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Life' as const,
    };

    expect(
      FeedFrontmatterSchema.parse({
        ...baseInput,
        contentType: 'essay',
      }).contentType
    ).toBe('essay');
    expect(
      FeedFrontmatterSchema.parse({
        ...baseInput,
        contentType: 'retrospective',
      }).contentType
    ).toBe('retrospective');
    expect(
      FeedFrontmatterSchema.parse({
        ...baseInput,
        contentType: 'review',
      }).contentType
    ).toBe('review');
  });

  it('rejects unsupported content types', () => {
    expect(() =>
      FeedFrontmatterSchema.parse({
        title: 'Example',
        slug: 'example',
        description: 'desc',
        date: '2026-04-13',
        category: 'Life',
        contentType: 'journal',
      })
    ).toThrow();
  });

  it('rejects scores outside the allowed range or increment', () => {
    const baseInput = {
      title: 'Example',
      slug: 'example',
      description: 'desc',
      date: '2026-04-13',
      category: 'Tech' as const,
      contentType: 'essay' as const,
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

    expect(() =>
      FeedFrontmatterSchema.parse({
        ...baseInput,
        qualityReview: {
          clarity: 2.25,
        },
      })
    ).toThrow(/0\.5 increments/);
  });
});
