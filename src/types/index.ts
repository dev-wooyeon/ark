// Feed Types
export interface BaseFeed {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  image?: string;
  readingTime?: number;
  featured?: boolean;
}

// 목록 표시용 (메타데이터만)
export type FeedData = BaseFeed;

// 전체 콘텐츠 포함 (상세 페이지용)
export interface Feed extends BaseFeed {
  contentHtml: string;
}

// Gray matter frontmatter 타입
export interface FeedFrontmatter {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  image?: string;
  readingTime?: number;
  featured?: boolean;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

// Common Types
export interface NavItem {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}
