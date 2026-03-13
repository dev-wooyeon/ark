import { Metadata } from 'next';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import { Header, Container } from '@/shared/layout';
import { PostList } from '@/features/blog/ui/components';

export const metadata: Metadata = {
  title: 'Life',
  description: '일상에서 배운 점과 오래 남은 생각을 차분하게 정리해요',
};

export default function LifePage() {
  const lifePosts = getSortedFeedData().filter((post) => post.category === 'Life');

  return (
    <>
      <Header />

      <main className="py-16">
        <Container size="md">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
              Life
            </h1>
            <p className="mt-4 text-lg text-[var(--color-grey-600)]">
              일상에서 배운 점과 오래 남은 생각을 차분하게 정리해요
            </p>
          </header>

          <PostList posts={lifePosts} layout="list" />
        </Container>
      </main>
    </>
  );
}
