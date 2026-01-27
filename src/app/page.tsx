import Link from 'next/link';
import TypingAnimation from '@/app/_components/TypingAnimation';

export default function Home() {
  return (
    <div className="flex flex-col h-full w-full p-[2.5rem_1rem] lg:flex-row lg:p-10">
      <div className="flex flex-col w-full gap-6 lg:w-1/2 lg:h-full lg:gap-24">
        <div>
          <span className="flex text-text-primary text-[clamp(6rem,15vw,10rem)] leading-none tracking-[-0.06em] -translate-x-2 font-light lg:text-[10rem] lg:-translate-x-8" role="img" aria-label="South Korea flag">🇰🇷</span>
          <h1 className="flex text-text-primary text-[clamp(6rem,15vw,10rem)] leading-none tracking-[-0.06em] font-light m-0 font-[ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] lg:text-[10rem]">eunu.log</h1>
        </div>
        <section className="w-full pb-2 pt-4 text-text-primary font-['JetBrains_Mono',var(--font-mono)] text-[clamp(1rem,2vw,2rem)] leading-[1.2] tracking-[-0.05em] font-light lg:text-[2rem]">
          <p className="m-0 font-light max-md:text-[0.95rem]">
            <TypingAnimation
              text='Make <span class="underline underline-offset-[3px] decoration-1 decoration-text-primary">Data</span>, <span class="underline underline-offset-[3px] decoration-1 decoration-text-primary">System</span>, <span class="underline underline-offset-[3px] decoration-1 decoration-text-primary">Creative</span> Things. Currently working as a Software Engineer <a href="https://981park.com" class="text-text-primary underline underline-offset-[3px] decoration-1 decoration-text-primary transition-all duration-200 hover:text-accent hover:decoration-accent" target="_blank" rel="noopener noreferrer">@9.81park</a>.'
            />
          </p>
        </section>
      </div>
      <div className="flex flex-col w-full h-full gap-6 mt-4 lg:w-1/2 lg:mt-0">
        <section className="w-full flex flex-col font-['JetBrains_Mono',var(--font-mono)] text-text-primary text-[clamp(1.25rem,2.5vw,2.5rem)] leading-[1.2] tracking-[-0.05em] lg:text-[2.5rem]">
          <Link href="/feed" className="text-text-primary underline underline-offset-4 decoration-1 decoration-text-primary transition-all duration-200 hover:text-accent hover:decoration-accent">
            Feed
          </Link>
          <Link href="/resume" className="text-text-primary underline underline-offset-4 decoration-1 decoration-text-primary transition-all duration-200 hover:text-accent hover:decoration-accent">
            Resume
          </Link>
        </section>
      </div>
    </div>
  );
}
