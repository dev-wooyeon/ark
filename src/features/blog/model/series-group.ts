import type { FeedData } from '@/domains/post/model/types';

export interface SeriesGroup {
  id: string;
  title: string;
  posts: FeedData[];
  latestDate: string;
}

export interface SeriesSummary {
  id: string;
  title: string;
  posts: FeedData[];
  latestDate: string;
  firstPostSlug: string | null;
  postCount: number;
  totalReadingMinutes: number;
}

function sortSeriesPosts(posts: FeedData[]): FeedData[] {
  return [...posts].sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}

function getLatestDate(posts: FeedData[]): string {
  if (posts.length === 0) {
    return '';
  }

  return posts.reduce(
    (latest, post) => (post.date > latest ? post.date : latest),
    posts[0].date
  );
}

export function getSeriesSummaries(posts: FeedData[]): SeriesSummary[] {
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
      const sortedPosts = sortSeriesPosts(value.posts);
      const latestDate = getLatestDate(sortedPosts);
      const firstPostSlug = sortedPosts[0]?.slug ?? null;
      const totalReadingMinutes = sortedPosts.reduce(
        (total, post) => total + (post.readingTime ?? 0),
        0
      );

      return {
        id,
        title: value.title,
        posts: sortedPosts,
        latestDate,
        firstPostSlug,
        postCount: sortedPosts.length,
        totalReadingMinutes,
      };
    })
    .sort((a, b) => {
      if (a.latestDate === b.latestDate) {
        return a.title.localeCompare(b.title, 'ko');
      }

      return a.latestDate < b.latestDate ? 1 : -1;
    });
}

export function getSeriesGroups(posts: FeedData[]): SeriesGroup[] {
  return getSeriesSummaries(posts).map(({ id, title, posts: groupedPosts, latestDate }) => ({
    id,
    title,
    posts: groupedPosts,
    latestDate,
  }));
}

export function formatSeriesDate(date: string): string {
  if (!date) {
    return '날짜 미정';
  }

  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
