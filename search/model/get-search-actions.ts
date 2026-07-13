import { Action } from 'kbar';
import { FeedData } from '@/blog/model/types';
import { AnalyticsEvents, trackEvent } from '@/infra/analytics/lib/analytics';

export type SearchablePost = Pick<
  FeedData,
  'slug' | 'title' | 'category' | 'tags' | 'description'
>;

interface NavigationActionSource {
  id: string;
  name: string;
  href: string;
  keywords: string;
  subtitle: string;
}

const navigationActions: NavigationActionSource[] = [
  {
    id: 'go-engineering',
    name: 'Tech',
    href: '/engineering',
    keywords: 'Tech Engineering 기술 글 시리즈',
    subtitle: '기술 글과 시리즈 보기',
  },
  {
    id: 'go-life',
    name: 'Life',
    href: '/life',
    keywords: 'Life 회고 에세이 일상',
    subtitle: '회고와 에세이 보기',
  },
  {
    id: 'go-resume',
    name: 'Resume',
    href: '/resume',
    keywords: 'Resume 이력서 경력 프로젝트',
    subtitle: '경력과 프로젝트 보기',
  },
];

/**
 * 전역 검색을 위한 액션 초기 데이터 생성 함수
 * 블로그 포스트를 검색할 수 있게 액션 객체 배열을 반환합니다.
 */
export const getSearchActions = (posts: SearchablePost[]): Action[] => {
  const getSearchKeywords = (post: SearchablePost) => {
    const normalizedTags = Array.isArray(post.tags) ? post.tags : [];

    return [post.title, post.category, ...normalizedTags, post.description]
      .filter(Boolean)
      .join(' ');
  };

  const postActions = posts.map((post) => ({
    id: post.slug,
    name: post.title,
    shortcut: [],
    keywords: getSearchKeywords(post),
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

  const sectionActions = navigationActions.map((action) => ({
    id: action.id,
    name: action.name,
    shortcut: [],
    keywords: action.keywords,
    section: '섹션',
    perform: () => {
      trackEvent(AnalyticsEvents.click, {
        target: 'command_palette_section',
        destination: action.href,
      });
      window.location.assign(action.href);
    },
    subtitle: action.subtitle,
  }));

  return [...sectionActions, ...postActions];
};
