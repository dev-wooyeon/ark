import { Action } from 'kbar';

/**
 * 전역 검색을 위한 액션 초기 데이터 생성 함수
 * 블로그 포스트, 카테고리 등을 검색할 수 있게 액션 객체 배열을 반환합니다.
 */
export const getSearchActions = (posts: any[]): Action[] => {
    const postActions = posts.map((post) => ({
        id: post.slug,
        name: post.title,
        shortcut: [],
        keywords: `${post.title} ${post.category} ${post.tags?.join(' ')} ${post.description}`,
        section: '블로그 포스트',
        perform: () => (window.location.href = `/blog/${post.slug}`),
        subtitle: post.description,
    }));

    const navigationActions = [
        {
            id: 'home',
            name: '홈으로 이동',
            shortcut: ['g', 'h'],
            keywords: 'home 메인',
            section: '이동',
            perform: () => (window.location.href = '/'),
        },
        {
            id: 'blog',
            name: '글 목록 보기',
            shortcut: ['g', 'b'],
            keywords: 'blog feed 게시글',
            section: '이동',
            perform: () => (window.location.href = '/blog'),
        },
        {
            id: 'resume',
            name: '이력서 보기',
            shortcut: ['g', 'r'],
            keywords: 'resume cv 자기소개서',
            section: '이동',
            perform: () => (window.location.href = '/resume'),
        },
    ];

    return [...navigationActions, ...postActions];
};
