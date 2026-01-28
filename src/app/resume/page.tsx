import { Metadata } from 'next';
import { Header, Footer, Container } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Resume',
  description: '은우의 이력서입니다',
};

export default function ResumePage() {
  return (
    <>
      <Header />

      <main className="py-16">
        <Container size="md">
          <header className="mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-grey-900)]">
              Resume
            </h1>
            <p className="mt-4 text-lg text-[var(--color-grey-600)]">
              소프트웨어 엔지니어 / 데이터 엔지니어
            </p>
          </header>

          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-4">
                Contact
              </h2>
              <ul className="space-y-2 text-[var(--color-grey-700)]">
                <li>Email: contact@eunu.log</li>
                <li>GitHub: github.com/eunu</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-4">
                Experience
              </h2>
              <div className="space-y-8">
                <article>
                  <h3 className="text-xl font-semibold text-[var(--color-grey-900)]">
                    9.81 Park - Software Engineer
                  </h3>
                  <p className="text-sm text-[var(--color-grey-600)] mt-1">
                    2023 - Present
                  </p>
                  <ul className="mt-4 space-y-2 text-[var(--color-grey-700)]">
                    <li>• 데이터 파이프라인 구축 및 운영</li>
                    <li>• 백엔드 시스템 개발 및 유지보수</li>
                    <li>• 자동화 시스템 구축</li>
                  </ul>
                </article>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--color-grey-900)] mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'PostgreSQL'].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[var(--color-grey-100)] text-[var(--color-grey-700)] text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </>
  );
}
