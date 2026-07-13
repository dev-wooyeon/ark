const DEFAULT_SITE_URL = 'https://ark-log.vercel.app';

export const SITE_BRAND = {
  englishName: 'Ark',
  koreanName: '아크',
  technicalName: 'ark',
} as const;

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return normalizeSiteUrl(
    configuredUrl && configuredUrl.length > 0 ? configuredUrl : DEFAULT_SITE_URL
  );
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = SITE_BRAND.englishName;
export const SITE_KOREAN_NAME = SITE_BRAND.koreanName;
export const SITE_DESCRIPTION = `${SITE_KOREAN_NAME}는 오래 건너갈 생각들을 싣는 개인의 방주입니다`;
export const SITE_FEED_PATH = '/rss.xml';
export const SITE_FEED_URL = `${SITE_URL}${SITE_FEED_PATH}`;
export const SITE_AUTHOR_EMAIL = 'une@kakao.com';

export const SITE_AUTHOR = {
  name: 'dev-wooyeon',
  profileUrl: `${SITE_URL}/resume`,
  sameAs: ['https://github.com/dev-wooyeon', `mailto:${SITE_AUTHOR_EMAIL}`],
};

export type SitePath = '' | `/${string}`;

export function createSiteUrl(path: SitePath = ''): string {
  if (path === '' || path === '/') {
    return SITE_URL;
  }

  return `${SITE_URL}${path}`;
}
