import fs from 'fs';
import path from 'path';
import type { FeedData, Feed, FeedFrontmatter } from '@/domains/post/model/types';
import { FeedFrontmatterSchema } from '@/domains/post/model/frontmatter-schema';

const postsDirectory = path.join(process.cwd(), 'posts');
const isProduction = process.env.NODE_ENV === 'production';

// Cache for folder path lookups by slug
const slugToFolderCache = new Map<string, string>();
let cachedSortedFeedData: FeedData[] | null = null;

// TOC item type
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

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

function safeExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch (error) {
    console.error(`Failed to check existence: ${p}`, error);
    return false;
  }
}

function isDirectory(p: string): boolean {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// Recursively find all post folders (folders with index.mdx + meta.json)
function findAllPostFolders(dir: string, relativePath: string = ''): string[] {
  const folders: string[] = [];
  const items = safeReaddir(dir);

  if (!items) return folders;

  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (!isDirectory(fullPath)) continue;

    const currentRelPath = relativePath ? `${relativePath}/${item}` : item;
    const hasIndex = safeExists(path.join(fullPath, 'index.mdx'));
    const hasMeta = safeExists(path.join(fullPath, 'meta.json'));

    if (hasIndex && hasMeta) {
      folders.push(currentRelPath);
    }

    // Recursively search subdirectories (for series folders)
    const subFolders = findAllPostFolders(fullPath, currentRelPath);
    folders.push(...subFolders);
  }

  return folders;
}

// Validate frontmatter
function validateFeedFrontmatter(
  data: unknown,
  folderPath: string
): FeedFrontmatter | null {
  const result = FeedFrontmatterSchema.safeParse(data);

  if (!result.success) {
    console.error(`Invalid frontmatter for ${folderPath}:`, result.error.format());
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

const CONTENT_IMAGE_SOURCE_REGEX =
  /!\[[^\]]*]\(([^)\s]+(?:\s+"[^"]*")?)\)|<(?:img|Image)\b[^>]*?\bsrc=["']([^"']+)["'][^>]*?>/g;

function normalizeImageSource(source: string): string {
  const trimmedSource = source.trim();

  if (
    trimmedSource.startsWith('<') &&
    trimmedSource.endsWith('>') &&
    trimmedSource.length > 2
  ) {
    return trimmedSource.slice(1, -1);
  }

  const [urlToken] = trimmedSource.split(/\s+/);
  return urlToken;
}

function extractFirstImageSource(content: string): string | undefined {
  const matches = content.matchAll(CONTENT_IMAGE_SOURCE_REGEX);

  for (const match of matches) {
    const candidateSource = match[1] ?? match[2];

    if (candidateSource) {
      return normalizeImageSource(candidateSource);
    }
  }

  return undefined;
}

// Load metadata from JSON file (folder path relative to posts/)
function loadMetadata(folderPath: string): FeedFrontmatter | null {
  const metaPath = path.join(postsDirectory, folderPath, 'meta.json');
  const metaContents = safeReadFile(metaPath);

  if (!metaContents) {
    console.error(`Metadata file not found: ${folderPath}/meta.json`);
    return null;
  }

  try {
    const data = JSON.parse(metaContents);
    const metadata = validateFeedFrontmatter(data, folderPath);

    if (!metadata) {
      return null;
    }

    const needsMdxRead = !metadata.readingTime || !metadata.image;

    if (needsMdxRead) {
      const mdxPath = path.join(postsDirectory, folderPath, 'index.mdx');
      const mdxContents = safeReadFile(mdxPath);

      if (mdxContents) {
        if (!metadata.readingTime) {
          metadata.readingTime = calculateReadingTime(mdxContents);
        }

        if (!metadata.image) {
          metadata.image = extractFirstImageSource(mdxContents);
        }
      }
    }

    // Cache the slug -> folder path mapping
    slugToFolderCache.set(metadata.slug, folderPath);

    return metadata;
  } catch (error) {
    console.error(`Failed to parse metadata for ${folderPath}:`, error);
    return null;
  }
}

// Get folder path from slug (using cache or scanning)
export function getFolderSlug(slug: string): string | null {
  // Check cache first
  if (slugToFolderCache.has(slug)) {
    return slugToFolderCache.get(slug)!;
  }

  // Populate slug cache by loading full feed index first
  getSortedFeedData();
  if (slugToFolderCache.has(slug)) {
    return slugToFolderCache.get(slug)!;
  }

  if (isProduction) {
    return null;
  }

  // If not cached, scan all folders to build cache
  const allFolders = findAllPostFolders(postsDirectory);

  for (const folderPath of allFolders) {
    const metadata = loadMetadata(folderPath);
    if (metadata?.slug === slug) {
      return folderPath;
    }
  }

  return null;
}

// Get all feed slugs for static generation
export function getAllFeedSlugs() {
  return getSortedFeedData().map((feed) => ({ slug: feed.slug }));
}

// Get sorted feed data for listing pages
export function getSortedFeedData(): FeedData[] {
  if (isProduction && cachedSortedFeedData) {
    return cachedSortedFeedData;
  }

  if (!safeExists(postsDirectory)) {
    console.warn('Posts directory does not exist');
    return [];
  }

  const allFolders = findAllPostFolders(postsDirectory);

  const allFeedData = allFolders
    .map((folderPath) => {
      const metadata = loadMetadata(folderPath);

      if (!metadata) {
        console.error(`Failed to load metadata for ${folderPath}, skipping`);
        return null;
      }

      return metadata as FeedData; // slug is already included in FeedFrontmatter
    })
    .filter((feed): feed is FeedData => feed !== null);

  // Sort by date (newest first)
  const sortedFeedData = allFeedData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  if (isProduction) {
    cachedSortedFeedData = sortedFeedData;
  }

  return sortedFeedData;
}

// Get single feed data with MDX component
export async function getFeedData(slug: string): Promise<Feed | null> {
  const folderPath = getFolderSlug(slug);

  if (!folderPath) {
    console.error(`Could not find folder for slug: ${slug}`);
    return null;
  }

  const metadata = loadMetadata(folderPath);

  if (!metadata) {
    console.error(`Failed to load metadata for ${folderPath}`);
    return null;
  }

  try {
    // Dynamic import of MDX file using folder path
    const mdxModule = await import(`@/../posts/${folderPath}/index.mdx`);

    return {
      ...metadata,
      Content: mdxModule.default,
    } as Feed;
  } catch (error) {
    console.error(`Failed to load MDX content for ${folderPath}:`, error);
    return null;
  }
}

// Get all posts in a series, sorted by order
export function getSeriesPosts(seriesId: string): FeedData[] {
  const allPosts = getSortedFeedData();

  return allPosts
    .filter(post => post.series?.id === seriesId)
    .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}
