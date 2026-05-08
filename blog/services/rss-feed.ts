import type { FeedData } from '@/blog/model/types';

interface CreateRssFeedOptions {
  posts: FeedData[];
  siteUrl: string;
  siteName: string;
  siteDescription: string;
  feedUrl?: string;
  buildDate?: Date;
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/$/, '');
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toCdata(value: string): string {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export function createRssFeed({
  posts,
  siteUrl,
  siteName,
  siteDescription,
  feedUrl,
  buildDate = new Date(),
}: CreateRssFeedOptions): string {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const escapedSiteName = escapeXml(siteName);
  const escapedSiteUrl = escapeXml(normalizedSiteUrl);
  const escapedFeedUrl = escapeXml(feedUrl ?? `${normalizedSiteUrl}/rss.xml`);
  const copyright = `Copyright ${buildDate.getFullYear()}, ${escapedSiteName}`;
  const feedItems = posts
    .map((post) => {
      const postUrl = `${normalizedSiteUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();

      return `
    <item>
      <title>${toCdata(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${toCdata(post.description)}</description>
      <category>${toCdata(post.category)}</category>
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapedSiteName}</title>
    <link>${escapedSiteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>ko-KR</language>
    <copyright>${copyright}</copyright>
    <lastBuildDate>${buildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${escapedFeedUrl}" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;
}
