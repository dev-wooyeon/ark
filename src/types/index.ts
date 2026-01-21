// Feed Types
export interface Feed {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags?: string[];
  image?: string;
  readingTime: number;
  featured: boolean;
  content: string;
}

export interface FeedData {
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
