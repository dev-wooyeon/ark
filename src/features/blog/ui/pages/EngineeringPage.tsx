import { Metadata } from 'next';
import { Suspense } from 'react';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { Header, Container } from '@/shared/layout';
import EngineeringPageClient from './EngineeringPageClient';

export const metadata: Metadata = {
  title: 'Engineering',
  description: '기술 글과 시리즈를 같은 흐름에서 살펴볼 수 있어요',
};

export default function EngineeringPage() {
  const engineeringPosts = getSortedFeedData().filter(
    (post) => post.category === 'Tech'
  );

  return (
    <>
      <Header />

      <main className="py-16">
        <Container size="md">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
              Engineering
            </h1>
            <p className="mt-4 text-lg text-[var(--color-grey-600)]">
              기술 글과 시리즈를 같은 흐름에서 살펴볼 수 있어요
            </p>
          </header>

          <Suspense fallback={null}>
            <EngineeringPageClient posts={engineeringPosts} />
          </Suspense>
        </Container>
      </main>
    </>
  );
}
