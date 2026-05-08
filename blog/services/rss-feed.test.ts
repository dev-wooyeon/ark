import { describe, expect, it } from 'vitest';
import type { FeedData } from '@/blog/model/types';
import { createRssFeed } from './rss-feed';

const post: FeedData = {
  title: 'RSS 테스트',
  slug: 'rss-test',
  description: 'RSS 설명',
  date: '2026-05-08',
  category: 'Tech',
  visibility: 'public',
  tags: ['rss'],
};

describe('createRssFeed', () => {
  it('serializes posts into an RSS 2.0 feed', () => {
    const xml = createRssFeed({
      posts: [post],
      siteUrl: 'https://example.com',
      siteName: 'Example',
      siteDescription: 'Example feed',
      buildDate: new Date('2026-05-08T00:00:00.000Z'),
    });

    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>Example</title>');
    expect(xml).toContain(
      '<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml" />'
    );
    expect(xml).toContain('<link>https://example.com/blog/rss-test</link>');
    expect(xml).toContain('<title><![CDATA[RSS 테스트]]></title>');
    expect(xml).toContain(
      '<lastBuildDate>Fri, 08 May 2026 00:00:00 GMT</lastBuildDate>'
    );
  });
});
