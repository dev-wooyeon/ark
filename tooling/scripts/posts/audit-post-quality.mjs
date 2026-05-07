import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const postsDirectory = path.join(process.cwd(), 'posts');
const CORE_REVIEW_KEYS = ['philosophy', 'design', 'implementation'];
const SHORT_PARAGRAPH_LIMIT = 80;
const LONG_PARAGRAPH_LIMIT = 700;

const FORMAL_ENDING_REGEX =
  /(습니다|합니다|됩니다|있습니다|없습니다|였습니다|입니다|겁니다|봅니다)[.!?。！？\s\n]/g;
const PLAIN_ENDING_REGEX =
  /(했다|한다|된다|있다|없다|였다|이다|본다|같다)[.!?。！？\s\n]/g;
const CASUAL_ENDING_REGEX =
  /(해요|했어요|돼요|되어요|예요|이에요|있어요|없어요|봐요)[.!?。！？\s\n]/g;
const MDX_IMAGE_REGEX =
  /!\[[^\]]*]\([^)]+\)|<(?:img|Image)\b[^>]*?\bsrc=["'][^"']+["'][^>]*?>/g;
const FENCED_CODE_REGEX = /```[\s\S]*?```/g;
const H2_REGEX = /^##\s+(.+)$/gm;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)]\([^)]+\)/g;
const HTML_TAG_REGEX = /<\/?[^>]+>/g;
const MDX_IMPORT_EXPORT_REGEX = /^\s*(import|export)\s.+$/gm;

function normalizeRelativePath(filePath) {
  return path.relative(process.cwd(), filePath);
}

function readUtf8(filePath, errors) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    errors.push(`${normalizeRelativePath(filePath)}: ${error.message}`);
    return null;
  }
}

function parseJson(filePath, errors) {
  const contents = readUtf8(filePath, errors);

  if (contents === null) {
    return null;
  }

  try {
    return JSON.parse(contents);
  } catch (error) {
    errors.push(`${normalizeRelativePath(filePath)}: ${error.message}`);
    return null;
  }
}

function findPostFolders(dir, relativePath = '') {
  const folders = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const currentRelativePath = relativePath
      ? `${relativePath}/${entry.name}`
      : entry.name;
    const currentPath = path.join(dir, entry.name);
    const hasMeta = fs.existsSync(path.join(currentPath, 'meta.json'));
    const hasIndex = fs.existsSync(path.join(currentPath, 'index.mdx'));

    if (hasMeta || hasIndex) {
      folders.push({
        fullPath: currentPath,
        relativePath: currentRelativePath,
        hasMeta,
        hasIndex,
      });
    }

    folders.push(...findPostFolders(currentPath, currentRelativePath));
  }

  return folders;
}

function stripMdx(content) {
  return content
    .replace(FENCED_CODE_REGEX, ' ')
    .replace(MDX_IMPORT_EXPORT_REGEX, ' ')
    .replace(MARKDOWN_LINK_REGEX, '$1')
    .replace(HTML_TAG_REGEX, ' ')
    .replace(/[>#*_`{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractParagraphs(content) {
  return content
    .replace(FENCED_CODE_REGEX, '\n\n')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => {
      if (!paragraph) {
        return false;
      }

      return !/^(import|export|#|[-*+]\s|\d+\.\s|>\s|\|)/.test(paragraph);
    })
    .map(stripMdx)
    .filter(Boolean);
}

function countMatches(content, regex) {
  return [...content.matchAll(regex)].length;
}

function countWords(content) {
  const tokens = stripMdx(content).match(/[A-Za-z0-9가-힣]+/g);
  return tokens?.length ?? 0;
}

function readCoreAverage(review) {
  if (!review || typeof review !== 'object') {
    return null;
  }

  const scores = CORE_REVIEW_KEYS.map((key) => review[key]);

  if (scores.some((score) => typeof score !== 'number')) {
    return null;
  }

  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

function hasIntroHook(paragraphs) {
  const intro = paragraphs[0] ?? '';

  return (
    /[?？]/.test(intro) ||
    /(문제|장애|어려움|고민|실패|불편|왜|어떻게)/.test(intro) ||
    /(배울|얻을|정리|기준|방법|흐름|전략|결과)/.test(intro)
  );
}

function hasReaderBenefitSection(content) {
  return /^##\s+.*(성과|변화|배운 점|적용 기준|기준|회고|결론|정리).*$/m.test(
    content
  );
}

function hasSupportingStructure(content) {
  return {
    table: /^\|.+\|$/m.test(content),
    list: /^(\s*[-*+]\s|\s*\d+\.\s)/m.test(content),
    code: FENCED_CODE_REGEX.test(content),
    image: MDX_IMAGE_REGEX.test(content),
  };
}

function hasTitleKeyword(meta) {
  const title = String(meta.title ?? '');
  const keywords = [
    ...(Array.isArray(meta.tags) ? meta.tags : []),
    String(meta.category ?? ''),
    meta.series?.title,
  ].filter((keyword) => typeof keyword === 'string' && keyword.length >= 2);

  return keywords.some((keyword) => title.includes(keyword));
}

function reviewPostQuality(meta, content) {
  const paragraphs = extractParagraphs(content);
  const paragraphLengths = paragraphs.map((paragraph) => paragraph.length);
  const h2Count = countMatches(content, H2_REGEX);
  const supportingStructure = hasSupportingStructure(content);
  const formalEndingCount = countMatches(content, FORMAL_ENDING_REGEX);
  const plainEndingCount = countMatches(content, PLAIN_ENDING_REGEX);
  const casualEndingCount = countMatches(content, CASUAL_ENDING_REGEX);
  const endingTotal = formalEndingCount + plainEndingCount + casualEndingCount;
  const formalEndingRatio =
    endingTotal === 0 ? 0 : formalEndingCount / endingTotal;
  const titleLength = String(meta.title ?? '').length;

  const advisoryWarnings = [];

  if (!hasIntroHook(paragraphs)) {
    advisoryWarnings.push('도입부 hook 약함');
  }

  if (h2Count < 2 || h2Count > 8) {
    advisoryWarnings.push(`H2 개수 확인 필요 (${h2Count})`);
  }

  if (!Object.values(supportingStructure).some(Boolean)) {
    advisoryWarnings.push('표/목록/코드/이미지 보조 구조 없음');
  }

  if (!hasReaderBenefitSection(content)) {
    advisoryWarnings.push('독자 효용 섹션 약함');
  }

  if (titleLength < 18 || titleLength > 38 || !hasTitleKeyword(meta)) {
    advisoryWarnings.push(`제목 구체성 확인 필요 (${titleLength}자)`);
  }

  const shortParagraphCount = paragraphLengths.filter(
    (length) => length > 0 && length < SHORT_PARAGRAPH_LIMIT
  ).length;
  const longParagraphCount = paragraphLengths.filter(
    (length) => length > LONG_PARAGRAPH_LIMIT
  ).length;

  if (shortParagraphCount >= 5) {
    advisoryWarnings.push(`짧은 문단 많음 (${shortParagraphCount})`);
  }

  if (longParagraphCount > 0) {
    advisoryWarnings.push(`긴 문단 있음 (${longParagraphCount})`);
  }

  return {
    characterCount: stripMdx(content).length,
    wordCount: countWords(content),
    titleLength,
    hasImage: supportingStructure.image,
    sectionCount: h2Count,
    paragraphCount: paragraphs.length,
    shortParagraphCount,
    longParagraphCount,
    style: {
      formalEndingCount,
      formalEndingRatio,
      plainEndingCount,
      casualEndingCount,
    },
    structure: {
      hasIntroHook: hasIntroHook(paragraphs),
      hasReaderBenefitSection: hasReaderBenefitSection(content),
      hasTitleKeyword: hasTitleKeyword(meta),
      supportingStructure,
    },
    advisoryWarnings,
  };
}

function evaluatePolicy(meta) {
  const visibility = meta.visibility ?? 'public';
  const coreAverage = readCoreAverage(meta.qualityReview);
  const warnings = [];

  if (visibility === 'public' && meta.series) {
    warnings.push('public series 글');
  }

  if (visibility === 'public' && meta.category === 'Tech') {
    if (coreAverage === null) {
      warnings.push('public Tech core 점수 누락');
    } else if (coreAverage <= 3) {
      warnings.push(`public Tech core 평균 ${coreAverage.toFixed(2)} <= 3.0`);
    }
  }

  if (meta.featured) {
    const brandFit = meta.qualityReview?.brandFit;

    if (typeof brandFit !== 'number' || brandFit < 4) {
      warnings.push('featured brandFit < 4.0');
    }
  }

  return {
    coreAverage,
    warnings,
  };
}

function determineStatus(meta, policy, quality) {
  const visibility = meta.visibility ?? 'public';

  if (visibility === 'private') {
    return 'keep-private';
  }

  if (policy.warnings.length > 0) {
    return 'revise';
  }

  return quality.advisoryWarnings.length <= 3 ? 'ready' : 'revise';
}

function auditPosts() {
  const errors = [];

  if (!fs.existsSync(postsDirectory)) {
    return {
      posts: [],
      errors: [`${normalizeRelativePath(postsDirectory)}: directory missing`],
    };
  }

  const folders = findPostFolders(postsDirectory);
  const posts = folders.flatMap((folder) => {
    const metaPath = path.join(folder.fullPath, 'meta.json');
    const indexPath = path.join(folder.fullPath, 'index.mdx');

    if (!folder.hasMeta || !folder.hasIndex) {
      errors.push(
        `${folder.relativePath}: meta.json and index.mdx must both exist`
      );
      return [];
    }

    const meta = parseJson(metaPath, errors);
    const content = readUtf8(indexPath, errors);

    if (meta === null || content === null) {
      return [];
    }

    const policy = evaluatePolicy(meta);
    const quality = reviewPostQuality(meta, content);

    return [
      {
        path: folder.relativePath,
        slug: String(meta.slug ?? folder.relativePath),
        title: String(meta.title ?? '(untitled)'),
        visibility: meta.visibility ?? 'public',
        category: meta.category ?? '(unknown)',
        series: meta.series?.title ?? null,
        qualityReview: meta.qualityReview ?? null,
        featured: Boolean(meta.featured),
        policy,
        quality,
        status: determineStatus(meta, policy, quality),
      },
    ];
  });

  posts.sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    posts,
    errors,
  };
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function formatCoreAverage(value) {
  return value === null ? 'n/a' : value.toFixed(2);
}

function printPostLine(post) {
  const policyText =
    post.policy.warnings.length === 0
      ? 'policy: ok'
      : `policy: ${post.policy.warnings.join(', ')}`;
  const advisoryText =
    post.quality.advisoryWarnings.length === 0
      ? 'advisory: ok'
      : `advisory: ${post.quality.advisoryWarnings.join(', ')}`;

  console.log(
    `- [${post.status}] ${post.slug} (${post.visibility}, ${post.category})`
  );
  console.log(
    `  core=${formatCoreAverage(post.policy.coreAverage)}, title=${
      post.quality.titleLength
    }자, chars=${post.quality.characterCount}, words=${
      post.quality.wordCount
    }, h2=${post.quality.sectionCount}, image=${
      post.quality.hasImage ? 'yes' : 'no'
    }`
  );
  console.log(
    `  style=formal ${formatPercent(
      post.quality.style.formalEndingRatio
    )} (${post.quality.style.formalEndingCount}), plain ${
      post.quality.style.plainEndingCount
    }, casual ${post.quality.style.casualEndingCount}; paragraphs short=${
      post.quality.shortParagraphCount
    }, long=${post.quality.longParagraphCount}`
  );
  console.log(`  ${policyText}`);
  console.log(`  ${advisoryText}`);
}

function printReport(posts, errors) {
  const privatePosts = posts.filter((post) => post.visibility === 'private');
  const publicTechPosts = posts.filter(
    (post) => post.visibility === 'public' && post.category === 'Tech'
  );
  const featuredPosts = posts.filter((post) => post.featured);
  const publicSeriesPosts = posts.filter(
    (post) => post.visibility === 'public' && post.series
  );

  console.log('# Post Quality Audit');
  console.log('');
  console.log(`Total posts: ${posts.length}`);
  console.log(`Public posts: ${posts.length - privatePosts.length}`);
  console.log(`Private posts: ${privatePosts.length}`);
  console.log(`Structural errors: ${errors.length}`);
  console.log('');

  console.log('## Private Posts');
  if (privatePosts.length === 0) {
    console.log('- none');
  } else {
    for (const post of privatePosts) {
      console.log(`- ${post.slug} (${post.title})`);
    }
  }
  console.log('');

  console.log('## Policy Checks');
  console.log(
    `- public Tech core average > 3.0: ${
      publicTechPosts.every(
        (post) =>
          post.policy.coreAverage !== null && post.policy.coreAverage > 3
      )
        ? 'ok'
        : 'review'
    }`
  );
  console.log(
    `- featured brandFit >= 4.0: ${
      featuredPosts.every((post) => {
        const brandFit = post.qualityReview?.brandFit;
        return typeof brandFit === 'number' && brandFit >= 4;
      })
        ? 'ok'
        : 'review'
    }`
  );
  console.log(
    `- public series posts: ${
      publicSeriesPosts.length === 0
        ? 'none'
        : publicSeriesPosts.map((post) => post.slug).join(', ')
    }`
  );
  console.log('');

  console.log('## Per-Post Review');
  for (const post of posts) {
    printPostLine(post);
  }

  if (errors.length > 0) {
    console.log('');
    console.log('## Structural Errors');
    for (const error of errors) {
      console.log(`- ${error}`);
    }
  }
}

const { posts, errors } = auditPosts();
printReport(posts, errors);

if (errors.length > 0) {
  process.exitCode = 1;
}
