import { describe, expect, it } from 'vitest';
import { CONTENT_TYPE_CHOICES, createPostMetadata } from './new-post.js';

describe('new-post metadata scaffold', () => {
  it('creates contentType and expanded quality review scaffold', () => {
    const metadata = createPostMetadata({
      title: '새 글',
      slug: 'new-post',
      description: '설명',
      date: '2026-06-17',
      category: 'Life',
      contentType: 'essay',
      tags: [' Life ', 'Essay', ''],
    });

    expect(CONTENT_TYPE_CHOICES.map((choice) => choice.value)).toEqual([
      'essay',
      'retrospective',
      'review',
    ]);
    expect(metadata).toMatchObject({
      category: 'Life',
      contentType: 'essay',
      visibility: 'private',
      tags: ['Life', 'Essay'],
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
        reviewedAt: '',
        notes: '',
      },
    });
  });
});
