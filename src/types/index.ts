// Feed Types
import { MDXProps } from 'mdx/types';

// 1. Base metadata (from JSON file)
export interface FeedFrontmatter {
  title: string;
  slug: string; // SEO-friendly URL slug (required)
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  image?: string;
  readingTime?: number;
  featured?: boolean;
  transliteratedTitle?: string;
  series?: {
    id: string;
    title: string;
    order: number;
  };
}

// 2. Feed Data for lists (adds slug)
export interface FeedData extends FeedFrontmatter {
  slug: string;
}

// 3. Full Feed with MDX component (replaces contentHtml)
export interface Feed extends FeedData {
  Content: React.ComponentType<MDXProps>;
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
