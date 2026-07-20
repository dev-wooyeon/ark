import Link from 'next/link';
import { Container } from '@/ui/layout';

export default function NotFound() {
  return (
    <main>
      <Container size="sm" className="py-24 text-center md:py-32">
        <p className="text-meta font-semibold text-[var(--color-toss-blue)]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-reading leading-relaxed text-[var(--color-text-secondary)]">
          주소가 바뀌었거나 글이 아직 공개되지 않았습니다. 홈에서 다른 기록을
          살펴보세요.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius-action)] bg-[var(--color-toss-blue)] px-5 text-sm font-semibold text-[var(--color-accent-foreground)] transition-colors hover:bg-[var(--color-toss-blue-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]"
        >
          홈으로 돌아가기
        </Link>
      </Container>
    </main>
  );
}
