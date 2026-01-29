import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFeedData, getAllFeedSlugs } from '@/lib/mdx-feeds';
import { getMdxSource, parseHeadingsFromMdx } from '@/lib/markdown';
import { Header, Container } from '@/components/layout';
import { ReadingProgress, TableOfContents } from '@/components/blog';
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

          {/* Content */}
          <div className="prose">
            <Content components={useMDXComponents({})} />
          </div>
        </Container>
      </article>

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
          image: [`https://eunu.log/og?title=${encodeURIComponent(post.title)}`],
        }}
      />

      <TableOfContents items={tocItems} />

    </>
  );
}
