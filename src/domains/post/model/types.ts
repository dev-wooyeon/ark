import type { MDXProps } from 'mdx/types';

export interface FeedFrontmatter {
  title: string;
  slug: string;
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

export interface FeedData extends FeedFrontmatter {
  slug: string;
}

export interface Feed extends FeedData {
  Content: React.ComponentType<MDXProps>;
}
