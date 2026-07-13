import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import { selectClientPosts } from './client-posts';

describe('selectClientPosts', () => {
  it('keeps search fields and removes internal editorial metadata', () => {
    const post: FeedData = {
      slug: 'trusted-post',
      title: '검증된 글',
      description: '검색 설명',
      date: '2026-07-13',
      category: 'Tech',
      contentType: 'retrospective',
      visibility: 'public',
      tags: ['Architecture'],
      qualityReview: {
        evidence: 4.5,
        notes: '공개 payload에 포함하면 안 되는 내부 메모',
      },
    };

    expect(selectClientPosts([post])).toEqual([
      {
        slug: 'trusted-post',
        title: '검증된 글',
        description: '검색 설명',
        category: 'Tech',
        tags: ['Architecture'],
      },
    ]);
  });
});
