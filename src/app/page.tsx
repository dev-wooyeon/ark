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
              (+82)
              <br />
              <span className="text-[var(--color-grey-900)]">안녕하세요.</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--color-grey-800)] leading-relaxed max-w-lg">
              Make Data, System, Creative things. <br /> Currently working as a software engineer {' '}
              <a
                href="https://981park.com"
                className="text-[var(--color-toss-blue)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @9.81park
              </a>
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
