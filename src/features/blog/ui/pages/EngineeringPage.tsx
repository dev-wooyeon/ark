import { Metadata } from 'next';
import { Suspense } from 'react';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { Header, Container } from '@/shared/layout';
import EngineeringPageClient from './EngineeringPageClient';

export const metadata: Metadata = {
  title: 'Engineering',
  description: '기술 아티클과 시리즈를 한곳에서 탐색합니다',
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
              기술 아티클과 시리즈를 함께 탐색할 수 있게 구성했어요
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
