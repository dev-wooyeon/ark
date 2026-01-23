// Feed Types
// Feed Types

// 1. Base metadata (from gray-matter frontmatter)
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

// 2. Feed Data for lists (adds slug)
export interface FeedData extends FeedFrontmatter {
  slug: string;
}

// 3. Full Feed with content (adds contentHtml)
export interface Feed extends FeedData {
  contentHtml: string;
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
