'use client';

import { Container } from '@/components/layout';
import { Button } from '@/components/ui';


export default function HeroSection() {

    return (
        <section className="relative py-20 md:py-32 overflow-hidden min-h-[90vh] flex flex-col bg-gradient-to-b from-white to-[#E8F3FF]">
            {/* <HeroBackground /> */}
            <Container size="md" className="flex-grow flex flex-col items-center text-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-grey-900)] leading-tight">
                    안녕하세요, 우연입니다
                </h1>

                <div className="mt-6 text-lg text-[var(--color-grey-800)] leading-tight font-mono">
                    <p>
                        Make Creative, Data, Systems things. <br />
                        Currently working as a Software Engineer <a href="https://981park.com">@9.81park</a>.

                    </p>
                </div>

                <div className="mt-8 flex gap-4">
                    <Button
                        as="a"
                        href="/blog"
                        className="!bg-[rgba(0,12,30,0.8)] !backdrop-blur-md !border !border-white/10 !text-white hover:!bg-[rgba(0,12,30,1)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span className="mr-2">📝</span>블로그 보기
                    </Button>
                    <Button
                        as="a"
                        href="/resume"
                        className="!bg-[rgba(0,12,30,0.8)] !backdrop-blur-md !border !border-white/10 !text-white hover:!bg-[rgba(0,12,30,1)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span className="mr-2">👨‍💻</span>이력서 보기
                    </Button>
                </div>
            </Container>

            {/* Scroll Hint */}
            <button
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="absolute bottom-10 left-0 right-0 mx-auto w-12 h-12 flex justify-center items-center pb-safe animate-bounce opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Scroll to next section"
            >
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-grey-600"
                >
                    <path
                        d="M36 18L24 30L12 18"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </section>
    );
}
