import { Action } from 'kbar';
import { FeedData } from '@/types';
import { AnalyticsEvents, trackEvent } from '@/lib/analytics';

type SearchablePost = Pick<
  FeedData,
  'slug' | 'title' | 'category' | 'tags' | 'description'
>;

/**
 * 전역 검색을 위한 액션 초기 데이터 생성 함수
 * 블로그 포스트를 검색할 수 있게 액션 객체 배열을 반환합니다.
 */
export const getSearchActions = (posts: SearchablePost[]): Action[] => {
  const postActions = posts.map((post) => ({
    id: post.slug,
    name: post.title,
    shortcut: [],
    keywords: `${post.title} ${post.category} ${post.tags?.join(' ')} ${post.description}`,
    section: '블로그 포스트',
    perform: () => {
      trackEvent(AnalyticsEvents.click, {
        target: 'command_palette_result',
        post_slug: post.slug,
      });
      window.location.assign(`/blog/${post.slug}`);
    },
    subtitle: post.description,
  }));

  return postActions;
};
