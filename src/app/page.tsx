import { Header, Footer, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { PostCard } from '@/components/blog';
import { getSortedFeedData } from '@/lib/mdx-feeds';

export default function HomePage() {
  const recentPosts = getSortedFeedData().slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <Container size="md">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-grey-900)] leading-tight">
              안녕하세요,
              <br />
              <span className="text-[var(--color-toss-blue)]">은우</span>입니다
            </h1>
            <p className="mt-6 text-lg text-[var(--color-grey-600)] leading-relaxed max-w-lg">
              데이터와 시스템, 창의적인 것들을 만듭니다. 현재{' '}
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
                블로그 보기
              </Button>
              <Button as="a" href="/resume" variant="secondary">
                이력서 보기
              </Button>
            </div>
          </Container>
        </section>

        {/* Recent Posts Section */}
        {recentPosts.length > 0 && (
          <section className="py-16 bg-[var(--color-grey-50)]">
            <Container>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-[var(--color-grey-900)]">
                  최근 글
                </h2>
                <a
                  href="/blog"
                  className="text-sm font-medium text-[var(--color-toss-blue)] hover:underline"
                >
                  전체 보기
                </a>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {recentPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </Container>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
