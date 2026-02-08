import fs from 'fs';
import path from 'path';
import { FeedData, Feed, FeedFrontmatter } from '@/types';
import { z } from 'zod';
import crypto from 'crypto';

const contentDirectory = path.join(process.cwd(), 'content');

// Helper to generate a stable hash for a folder name
export function getPublicSlug(folderSlug: string): string {
  return crypto.createHash('md5').update(folderSlug).digest('hex').slice(0, 10);
}

// Helper to find original folder name from hash
export function getFolderSlug(publicSlug: string): string | null {
  if (!safeExists(contentDirectory)) return null;
  const dirNames = safeReaddir(contentDirectory);
  if (!dirNames) return null;

  return (
    dirNames.find((dirName) => {
      const dirPath = path.join(contentDirectory, dirName);
      try {
        if (!fs.statSync(dirPath).isDirectory()) return false;
        return getPublicSlug(dirName) === publicSlug;
      } catch (e) {
        return false;
      }
    }) || null
  );
}

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
function validateFeedFrontmatter(
  data: unknown,
  slug: string
): FeedFrontmatter | null {
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

// Load metadata from JSON file (internal folder slug)
function loadMetadata(folderSlug: string): FeedFrontmatter | null {
  const metaPath = path.join(contentDirectory, folderSlug, 'meta.json');
  const metaContents = safeReadFile(metaPath);

  if (!metaContents) {
    console.error(`Metadata file not found: ${folderSlug}/meta.json`);
    return null;
  }

  try {
    const data = JSON.parse(metaContents);
    const metadata = validateFeedFrontmatter(data, folderSlug);

    if (!metadata) {
      return null;
    }

    // Auto-calculate reading time if not present
    if (!metadata.readingTime) {
      const mdxPath = path.join(contentDirectory, folderSlug, 'index.mdx');
      const mdxContents = safeReadFile(mdxPath);
      if (mdxContents) {
        metadata.readingTime = calculateReadingTime(mdxContents);
      }
    }

    return metadata;
  } catch (error) {
    console.error(`Failed to parse metadata for ${folderSlug}:`, error);
    return null;
  }
}

// Get all feed slugs for static generation (uses hashed slugs)
export function getAllFeedSlugs() {
  if (!safeExists(contentDirectory)) {
    console.warn('Content directory does not exist');
    return [];
  }

  const dirNames = safeReaddir(contentDirectory);
  if (!dirNames) {
    console.error('Failed to read content directory');
    return [];
  }

  // Get slugs from directory names and convert to public hash
  return dirNames
    .filter((dirName) => {
      const dirPath = path.join(contentDirectory, dirName);
      try {
        return fs.statSync(dirPath).isDirectory();
      } catch (e) {
        return false;
      }
    })
    .map((dirName) => ({
      slug: getPublicSlug(dirName),
    }));
}

// Get sorted feed data for listing pages (uses hashed slugs)
export function getSortedFeedData(): FeedData[] {
  if (!safeExists(contentDirectory)) {
    console.warn('Content directory does not exist');
    return [];
  }

  const dirNames = safeReaddir(contentDirectory);
  if (!dirNames) {
    console.error('Failed to read content directory');
    return [];
  }

  const allFeedData = dirNames
    .filter((dirName) => {
      const dirPath = path.join(contentDirectory, dirName);
      try {
        return fs.statSync(dirPath).isDirectory();
      } catch (e) {
        return false;
      }
    })
    .map((dirName) => {
      const folderSlug = dirName;
      const metadata = loadMetadata(folderSlug);

      if (!metadata) {
        console.error(`Failed to load metadata for ${folderSlug}, skipping`);
        return null;
      }

      return {
        slug: getPublicSlug(folderSlug),
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

// Get single feed data with MDX component (slug can be hash or original)
export async function getFeedData(slug: string): Promise<Feed | null> {
  // Try to find the folder slug if a hash was passed
  const folderSlug = getFolderSlug(slug) || slug;

  const metadata = loadMetadata(folderSlug);

  if (!metadata) {
    console.error(`Failed to load metadata for ${folderSlug}`);
    return null;
  }

  try {
    // Dynamic import of MDX file using folder slug
    const mdxModule = await import(`@/../content/${folderSlug}/index.mdx`);

    return {
      slug: getPublicSlug(folderSlug),
      ...metadata,
      Content: mdxModule.default,
    };
  } catch (error) {
    console.error(`Failed to load MDX content for ${folderSlug}:`, error);
    return null;
  }
}
