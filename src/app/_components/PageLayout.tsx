import BackLink from './BackLink';

interface PageLayoutProps {
  title: string;
  backHref?: string;
  backText?: string;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  backHref = '/',
  backText = '← Home',
  children
}: PageLayoutProps) {
  return (
    <div className="min-h-screen p-8 bg-primary max-md:p-4">
      <header className="max-w-[800px] mx-auto pb-8">
        <BackLink href={backHref} text={backText} />
        <h1 className="font-sans text-display-md font-bold text-text-primary m-0 tracking-[-0.02em] max-md:text-[2rem]">
          {title}
        </h1>
      </header>
      <main className="max-w-[800px] mx-auto">
        {children}
      </main>
    </div>
  );
}
