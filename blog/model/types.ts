import type { MDXProps } from 'mdx/types';

export type PostCategory = 'Tech' | 'Life';
export type PostContentType = 'essay' | 'retrospective' | 'review';
export type PostVisibility = 'public' | 'private';
export type QualityScore = number | null;

export interface QualityReview {
  philosophy?: QualityScore;
  design?: QualityScore;
  implementation?: QualityScore;
  brandFit?: QualityScore;
  clarity?: QualityScore;
  structure?: QualityScore;
  evidence?: QualityScore;
  usefulness?: QualityScore;
  originality?: QualityScore;
  polish?: QualityScore;
  reviewedAt?: string;
  notes?: string;
}

export interface FeedFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  category: PostCategory;
  contentType: PostContentType;
  visibility?: PostVisibility;
  tags?: string[];
  image?: string;
  readingTime?: number;
  featured?: boolean;
  transliteratedTitle?: string;
  qualityReview?: QualityReview;
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
