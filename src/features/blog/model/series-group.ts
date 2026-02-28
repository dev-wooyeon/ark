import type { FeedData } from '@/domains/post/model/types';

export interface SeriesGroup {
  id: string;
  title: string;
  posts: FeedData[];
  latestDate: string;
}

export function getSeriesGroups(posts: FeedData[]): SeriesGroup[] {
  const groups = new Map<string, { title: string; posts: FeedData[] }>();

  posts.forEach((post) => {
    if (!post.series) return;

    const existing = groups.get(post.series.id);
    if (existing) {
      existing.posts.push(post);
      return;
    }

    groups.set(post.series.id, {
      title: post.series.title,
      posts: [post],
    });
  });

  return Array.from(groups.entries())
    .map(([id, value]) => {
      const sortedPosts = [...value.posts].sort(
        (a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0)
      );

      const latestDate = sortedPosts.reduce(
        (latest, post) => (post.date > latest ? post.date : latest),
        sortedPosts[0]?.date ?? ''
      );

      return {
        id,
        title: value.title,
        posts: sortedPosts,
        latestDate,
      };
    })
    .sort((a, b) => (a.latestDate < b.latestDate ? 1 : -1));
}

export function formatSeriesDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
