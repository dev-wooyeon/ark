import Link from 'next/link';
import { Header, Footer, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { PostCard } from '@/components/blog';
import { getSortedFeedData } from '@/lib/mdx-feeds';
import HeroBackground from '@/components/home/HeroBackground';

export default function HomePage() {
  const recentPosts = getSortedFeedData().slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* <HeroBackground /> */}
          <Container size="md">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-grey-900)] leading-tight">
              안녕하세요,
              <br />
              <span className="text-[var(--color-toss-blue)]">우연</span>입니다
            </h1>
            <p className="mt-6 text-lg text-[var(--color-grey-600)] leading-relaxed max-w-lg">
              데이터와 시스템, 창의적인 것들을 만듭니다. <br />현재{' '}
              <a
                href="https://981park.com"
                className="text-[var(--color-toss-blue)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @9.81park
              </a>
              에서 소프트웨어 엔지니어로 일하고 있어요.
            </p>
            <div className="mt-8 flex gap-4">
              <Button as="a" href="/blog">
                <span className="tossface mr-2">📝</span>블로그 보기
              </Button>
              <Button as="a" href="/resume" variant="secondary">
                <span className="tossface mr-2">👨‍💻</span>이력서 보기
              </Button>
            </div>
          </Container>
        </section>

      </main>


    </>
  );
}
