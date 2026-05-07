import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'posts');
const PUBLIC_IMAGE_ROOT = path.join(process.cwd(), 'public', 'images', 'posts');

const IMAGE_URL_REGEX =
  /!\[[^\]]*]\((https?:\/\/[^)\s]+)\)|<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/g;

const CONTENT_TYPE_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'image/svg+xml': '.svg',
};

async function walkDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) return walkDirectory(fullPath);
      return fullPath.endsWith('/index.mdx') || fullPath.endsWith('\\index.mdx')
        ? [fullPath]
        : [];
    })
  );

  return files.flat();
}

function getFileExtension(urlString, contentType) {
  try {
    const pathname = new URL(urlString).pathname;
    const rawExt = path.extname(pathname).toLowerCase();
    if (rawExt && rawExt !== '.php') {
      return rawExt === '.jpeg' ? '.jpg' : rawExt;
    }
  } catch {
    // noop
  }

  if (contentType && CONTENT_TYPE_TO_EXT[contentType]) {
    return CONTENT_TYPE_TO_EXT[contentType];
  }

  return '.png';
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(outputPath, Buffer.from(arrayBuffer));

  const contentTypeHeader = response.headers.get('content-type') || '';
  return contentTypeHeader.split(';')[0].trim().toLowerCase();
}

function collectImageUrls(content) {
  const urls = [];
  const seen = new Set();

  for (const match of content.matchAll(IMAGE_URL_REGEX)) {
    const url = match[1] || match[2];
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }

  return urls;
}

async function localizeImagesInFile(filePath) {
  const original = await fs.readFile(filePath, 'utf8');
  const imageUrls = collectImageUrls(original);

  if (imageUrls.length === 0) {
    return { updated: false, downloads: 0, filePath };
  }

  const slug = toPosixPath(path.relative(POSTS_DIR, path.dirname(filePath)));
  const outputDir = path.join(PUBLIC_IMAGE_ROOT, slug);
  await ensureDirectory(outputDir);

  const replacements = new Map();
  let downloads = 0;

  for (const url of imageUrls) {
    const hash = createHash('sha1').update(url).digest('hex').slice(0, 12);
    const provisionalExt = getFileExtension(url);
    let fileName = `${hash}${provisionalExt}`;
    let outputPath = path.join(outputDir, fileName);
    let publicPath = `/images/posts/${slug}/${fileName}`;

    try {
      await fs.access(outputPath);
      replacements.set(url, publicPath);
      continue;
    } catch {
      // file does not exist
    }

    const contentType = await downloadImage(url, outputPath);
    const resolvedExt = getFileExtension(url, contentType);

    if (resolvedExt !== provisionalExt) {
      const correctedFileName = `${hash}${resolvedExt}`;
      const correctedOutputPath = path.join(outputDir, correctedFileName);

      await fs.rename(outputPath, correctedOutputPath);
      fileName = correctedFileName;
      outputPath = correctedOutputPath;
      publicPath = `/images/posts/${slug}/${fileName}`;
    }

    replacements.set(url, publicPath);
    downloads += 1;
  }

  let updatedContent = original;
  for (const [remoteUrl, localUrl] of replacements) {
    updatedContent = updatedContent.split(remoteUrl).join(localUrl);
  }

  if (updatedContent !== original) {
    await fs.writeFile(filePath, updatedContent, 'utf8');
    return { updated: true, downloads, filePath };
  }

  return { updated: false, downloads, filePath };
}

async function main() {
  const mdxFiles = await walkDirectory(POSTS_DIR);
  let updatedFiles = 0;
  let downloadedFiles = 0;

  for (const filePath of mdxFiles) {
    const result = await localizeImagesInFile(filePath);
    if (result.updated) {
      updatedFiles += 1;
    }
    downloadedFiles += result.downloads;
  }

  console.log(
    `[localize-post-images] updated files: ${updatedFiles}, downloaded images: ${downloadedFiles}`
  );
}

main().catch((error) => {
  console.error('[localize-post-images] failed:', error);
  process.exitCode = 1;
});
