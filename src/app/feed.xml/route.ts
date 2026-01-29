import { getSortedFeedData } from '@/lib/mdx-feeds';

const SITE_URL = 'https://eunu-log.vercel.app';

export async function GET() {
    const allPosts = getSortedFeedData();

    const feedItems = allPosts
        .map((post) => {
            const postUrl = `${SITE_URL}/blog/${post.slug}`;
            const pubDate = new Date(post.date).toUTCString();

            return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      <category><![CDATA[${post.category}]]></category>
    </item>`;
        })
        .join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/svg">
  <channel>
    <title>eunu.log</title>
    <link>${SITE_URL}</link>
    <description>데이터와 시스템, 창의적인 것들을 만듭니다</description>
    <language>ko-KR</language>
    <copyright>Copyright ${new Date().getFullYear()}, eunu.log</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        },
    });
}
