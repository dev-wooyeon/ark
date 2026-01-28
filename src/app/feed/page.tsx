import Link from 'next/link';
import { getSortedFeedData } from '@/lib/mdx-feeds';
import FeedList from './_components/FeedList';
import BackLink from '../_components/BackLink';

export default function FeedPage() {
  const allFeedData = getSortedFeedData();

  return (
    <div className="min-h-screen p-8 bg-primary max-md:p-4">
      <header className="max-w-[800px] mx-auto pb-8">
        <BackLink href="/" text="← Home" />
        <h1 className="font-sans text-display-md font-bold text-text-primary m-0 tracking-[-0.02em] max-md:text-[2rem]">Feed</h1>
      </header>

      <main className="max-w-[800px] mx-auto">
        <FeedList feed={allFeedData} />
      </main>
    </div>
  );
}
