import { Metadata } from 'next';
import { getSortedFeedData } from '@/blog/services/post-repository';
import { Container } from '@/ui/layout';
import { createSiteUrl } from '@/site/config/site';
import BlogListClient from './BlogListClient';

const blogUrl = createSiteUrl('/blog');
const description = '개발과 일상에 대한 이야기를 나눕니다';

export const metadata: Metadata = {
  title: 'Blog',
  description,
  alternates: {
    canonical: blogUrl,
  },
  openGraph: {
    title: 'Blog',
    description,
    url: blogUrl,
  },
};

export default function BlogPage() {
  const allPosts = getSortedFeedData();

  return (
    <main className="py-10">
      <Container size="md">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
            Blog
          </h1>
          <p className="mt-4 text-lg text-[var(--color-grey-600)]">
            개발과 일상에 대한 이야기를 나눕니다
          </p>
        </header>

        <BlogListClient posts={allPosts} />
      </Container>
    </main>
  );
}
