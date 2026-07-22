import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getFeedData,
  getAllFeedSlugs,
  getSeriesPosts,
} from '@/blog/services/post-repository';
import {
  getMdxSource,
  parseHeadingsFromMdx,
} from '@/blog/services/markdown-parser';
import { Container } from '@/ui/layout';
import {
  ReadingProgress,
  TableOfContents,
  GiscusComments,
  SeriesNavigation,
  ViewCounter,
} from '@/blog/ui/components';
import PostViewTracker from '@/infra/analytics/components/PostViewTracker';
import DwellTimeTracker from '@/infra/analytics/components/DwellTimeTracker';
import ScrollDepthTracker from '@/infra/analytics/components/ScrollDepthTracker';
import JsonLd from '@/infra/seo/JsonLd';
import { getMDXComponents } from '@/blog/ui/mdx/components';
import { SITE_AUTHOR, createSiteUrl } from '@/site/config/site';

const shouldIncludePrivatePreview = process.env.NODE_ENV === 'development';

function createPostUrl(slug: string): string {
  return createSiteUrl(`/blog/${slug}`);
}

function createPostOgImageUrl({
  title,
  date,
  tags,
}: {
  title: string;
  date: string;
  tags?: string[];
}): string {
  const params = new URLSearchParams({
    title,
    date,
  });

  if (tags && tags.length > 0) {
    params.set('tags', tags.join(','));
  }

  return `${createSiteUrl('/api/og')}?${params.toString()}`;
}

export async function generateStaticParams() {
  return getAllFeedSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getFeedData(slug, {
    includePrivate: shouldIncludePrivatePreview,
  });

  if (!post) {
    return { title: '글을 찾을 수 없습니다' };
  }

  const postUrl = createPostUrl(post.slug);
  const ogImageUrl = createPostOgImageUrl(post);
  const modifiedTime = post.updated ?? post.date;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      modifiedTime,
      authors: [SITE_AUTHOR.name],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [
        {
          url: ogImageUrl,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getFeedData(slug, {
    includePrivate: shouldIncludePrivatePreview,
  });

  if (!post) {
    notFound();
  }

  const mdxSource = getMdxSource(slug);
  const tocItems = mdxSource ? parseHeadingsFromMdx(mdxSource) : [];

  // Get series posts if this post belongs to a series
  const seriesPosts = post.series ? getSeriesPosts(post.series.id) : [];

  const { Content } = post;
  const formattedDate = new Date(post.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const readingTimeLabel = post.readingTime ? `약 ${post.readingTime}분` : null;
  const mdxComponents = getMDXComponents({});
  const postUrl = createPostUrl(post.slug);
  const ogImageUrl = createPostOgImageUrl(post);
  const modifiedTime = post.updated ?? post.date;

  return (
    <>
      <ReadingProgress />
      <PostViewTracker
        slug={post.slug}
        category={post.category}
        tags={post.tags}
      />
      <DwellTimeTracker slug={post.slug} />
      <ScrollDepthTracker slug={post.slug} />

      <article className="py-10">
        <Container size="md">
          {/* Header */}
          <header className="mb-10">
            <span className="mb-4 inline-block rounded-[var(--radius-selection)] bg-[var(--color-bg-secondary)] px-3 py-1 text-sm font-medium text-[var(--color-text-secondary)]">
              {post.category}
            </span>
            <h1 className="text-3xl font-bold leading-tight text-[var(--color-text-primary)] md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)]">
              <time>{formattedDate}</time>
              {readingTimeLabel && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[var(--color-divider)]" />
                  <span>{readingTimeLabel}</span>
                </>
              )}
              <span className="h-1 w-1 rounded-full bg-[var(--color-divider)]" />
              <ViewCounter slug={post.slug} />
            </div>
            {post.tags && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[var(--radius-selection)] bg-[var(--color-bg-secondary)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-text-tertiary)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Series Navigation */}
          {post.series && seriesPosts.length > 0 && (
            <SeriesNavigation
              currentSlug={post.slug}
              seriesTitle={post.series.title}
              seriesPosts={seriesPosts}
              currentOrder={post.series.order}
            />
          )}

          {/* Content */}
          <div className="prose">
            <Content components={mdxComponents} />
          </div>
        </Container>
      </article>

      {/* Comments */}
      <section className="py-12">
        <Container size="md">
          <GiscusComments slug={slug} />
        </Container>
      </section>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl,
          },
          url: postUrl,
          headline: post.title,
          description: post.description,
          author: {
            '@type': 'Person',
            name: SITE_AUTHOR.name,
            url: SITE_AUTHOR.profileUrl,
            sameAs: SITE_AUTHOR.sameAs,
          },
          datePublished: post.date,
          dateModified: modifiedTime,
          image: [ogImageUrl],
          keywords: post.tags ?? [],
          inLanguage: 'ko-KR',
          isAccessibleForFree: true,
        }}
      />

      <TableOfContents items={tocItems} />
    </>
  );
}
