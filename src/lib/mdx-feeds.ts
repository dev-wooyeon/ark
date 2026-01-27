import fs from 'fs';
import path from 'path';
import { FeedData, Feed, FeedFrontmatter } from '@/types';
import { z } from 'zod';

const feedsDirectory = path.join(process.cwd(), 'feeds');

// TOC item type
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}


// Zod schema for validation (same as before)
const FeedFrontmatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
  readingTime: z.number().optional(),
  featured: z.boolean().optional(),
  updated: z.string().optional(),
  transliteratedTitle: z.string().optional(),
});

// Safe file system utilities
function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error);
    return null;
  }
}

function safeReaddir(dirPath: string): string[] | null {
  try {
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(`Failed to read directory: ${dirPath}`, error);
    return null;
  }
}

function safeExists(path: string): boolean {
  try {
    return fs.existsSync(path);
  } catch (error) {
    console.error(`Failed to check existence: ${path}`, error);
    return false;
  }
}

// Validate frontmatter
function validateFeedFrontmatter(data: unknown, slug: string): FeedFrontmatter | null {
  const result = FeedFrontmatterSchema.safeParse(data);

  if (!result.success) {
    console.error(`Invalid frontmatter for ${slug}:`, result.error.format());
    return null;
  }

  return result.data;
}

// Calculate reading time from MDX content
function calculateReadingTime(content: string): number {
  const cleanContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image links
    .replace(/\[.*?\]\(.*?\)/g, '$1') // Keep text of links
    .replace(/[#*`]/g, ''); // Remove basic markdown syntax
  const length = cleanContent.length;
  return Math.ceil(length / 500) || 1; // 500 characters per minute, min 1 min
}

// Load metadata from JSON file
function loadMetadata(slug: string): FeedFrontmatter | null {
  const metaPath = path.join(feedsDirectory, `${slug}.meta.json`);
  const metaContents = safeReadFile(metaPath);

  if (!metaContents) {
    console.error(`Metadata file not found: ${slug}.meta.json`);
    return null;
  }

  try {
    const data = JSON.parse(metaContents);
    const metadata = validateFeedFrontmatter(data, slug);

    if (!metadata) {
      return null;
    }

    // Auto-calculate reading time if not present
    if (!metadata.readingTime) {
      const mdxPath = path.join(feedsDirectory, `${slug}.mdx`);
      const mdxContents = safeReadFile(mdxPath);
      if (mdxContents) {
        metadata.readingTime = calculateReadingTime(mdxContents);
      }
    }

    return metadata;
  } catch (error) {
    console.error(`Failed to parse metadata for ${slug}:`, error);
    return null;
  }
}

// Get all feed slugs for static generation
export function getAllFeedSlugs() {
  if (!safeExists(feedsDirectory)) {
    console.warn('Feeds directory does not exist');
    return [];
  }

  const fileNames = safeReaddir(feedsDirectory);
  if (!fileNames) {
    console.error('Failed to read feeds directory');
    return [];
  }

  // Get unique slugs from .mdx files
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ''),
    }));
}

// Get sorted feed data for listing pages
export function getSortedFeedData(): FeedData[] {
  if (!safeExists(feedsDirectory)) {
    console.warn('Feeds directory does not exist');
    return [];
  }

  const fileNames = safeReaddir(feedsDirectory);
  if (!fileNames) {
    console.error('Failed to read feeds directory');
    return [];
  }

  const allFeedData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const metadata = loadMetadata(slug);

      if (!metadata) {
        console.error(`Failed to load metadata for ${slug}, skipping`);
        return null;
      }

      return {
        slug,
        ...metadata,
      };
    })
    .filter((feed): feed is FeedData => feed !== null);

  // Sort by date
  return allFeedData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Get single feed data with MDX component
export async function getFeedData(slug: string): Promise<Feed | null> {
  const metadata = loadMetadata(slug);

  if (!metadata) {
    console.error(`Failed to load metadata for ${slug}`);
    return null;
  }

  try {
    // Dynamic import of MDX file
    const mdxModule = await import(`@/../feeds/${slug}.mdx`);

    return {
      slug,
      ...metadata,
      Content: mdxModule.default,
    };
  } catch (error) {
    console.error(`Failed to load MDX content for ${slug}:`, error);
    return null;
  }
}
