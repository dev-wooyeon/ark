import { Metadata } from 'next';
import { getSortedFeedData } from '@/lib/mdx-feeds';
import { Header, Footer, Container } from '@/components/layout';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = {
  title: 'Blog',
  description: '개발과 일상에 대한 이야기를 나눕니다',
};

export default function BlogPage() {
  const allPosts = getSortedFeedData();

  return (
    <>
      <Header />

      <main className="py-16">
        <Container>
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

      <Footer />
    </>
  );
}
