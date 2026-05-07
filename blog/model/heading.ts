const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\([^)]*\)/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]*\)/g;
const INLINE_CODE_REGEX = /(`+)([^`]*?)\1/g;
const HTML_TAG_REGEX = /<\/?[A-Za-z][^>]*>/g;
const ESCAPED_CHARACTER_REGEX = /\\([\\`*_[\]{}()#+\-.!<>|])/g;
const TRAILING_HEADING_MARKER_REGEX = /\s+#+\s*$/;

export function normalizeHeadingText(text: string): string {
  let normalizedText = text.trim();

  if (!normalizedText) {
    return '';
  }

  normalizedText = normalizedText
    .replace(MARKDOWN_IMAGE_REGEX, '$1')
    .replace(MARKDOWN_LINK_REGEX, '$1')
    .replace(INLINE_CODE_REGEX, '$2')
    .replace(HTML_TAG_REGEX, '')
    .replace(TRAILING_HEADING_MARKER_REGEX, '');

  let previousText: string | null = null;
  while (normalizedText !== previousText) {
    previousText = normalizedText;
    normalizedText = normalizedText
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/~~(.*?)~~/g, '$1');
  }

  return normalizedText
    .replace(ESCAPED_CHARACTER_REGEX, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildHeadingSlug(text: string): string {
  return normalizeHeadingText(text)
    .toLowerCase()
    .replace(
      /[^\w\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uD7B0-\uD7FF\s-]/g,
      ''
    )
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function createHeadingIdGenerator() {
  const idCounts: Record<string, number> = {};

  return (text: string): string | null => {
    const baseId = buildHeadingSlug(text);

    if (!baseId) {
      return null;
    }

    const count = idCounts[baseId] ?? 0;
    idCounts[baseId] = count + 1;

    return count === 0 ? baseId : `${baseId}-${count}`;
  };
}
