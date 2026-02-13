import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFeedData, getAllFeedSlugs, getSeriesPosts } from '@/lib/mdx-feeds';
import { getMdxSource, parseHeadingsFromMdx } from '@/lib/markdown';
import { Header, Container } from '@/components/layout';
import {
  ReadingProgress,
  TableOfContents,
  GiscusComments,
  SeriesNavigation,
  ViewCounter,
} from '@/components/blog';
import JsonLd from '@/components/seo/JsonLd';
import { useMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
  return getAllFeedSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getFeedData(slug);

  if (!post) {
    return { title: '글을 찾을 수 없습니다' };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Eunu'],
      tags: post.tags,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&date=${post.date}&tags=${post.tags?.join(',') || ''}`,
          width: 1200,
          height: 630,
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
  const post = await getFeedData(slug);

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

  return (
    <>
      <ReadingProgress />
      <Header />

      <article className="py-16">
        <Container size="md">
          {/* Header */}
          <header className="mb-12 text-center">
            <span className="inline-block px-3 py-1 text-sm font-medium text-[var(--color-toss-blue)] bg-[var(--color-toss-blue)]/10 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)] leading-tight">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[var(--color-grey-500)]">
              <time>{formattedDate}</time>
              {post.readingTime && (
                <>
                  <span className="w-1 h-1 bg-[var(--color-grey-300)] rounded-full" />
                  <span>{post.readingTime}분 읽기</span>
                </>
              )}
              <span className="w-1 h-1 bg-[var(--color-grey-300)] rounded-full" />
              <ViewCounter slug={post.slug} />
            </div>
            {post.tags && (
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[var(--color-grey-500)] bg-[var(--color-grey-100)] px-2 py-1 rounded"
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
            <Content components={useMDXComponents({})} />
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
          headline: post.title,
          description: post.description,
          author: {
            '@type': 'Person',
            name: 'Eunu',
          },
          datePublished: post.date,
          image: [
            `https://eunu.log/og?title=${encodeURIComponent(post.title)}`,
          ],
        }}
      />

      <TableOfContents items={tocItems} />
    </>
  );
}
