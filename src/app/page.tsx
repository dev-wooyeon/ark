import { Header } from '@/components/layout';
import { getSortedFeedData } from '@/lib/mdx-feeds';
import HeroSection from '@/components/home/HeroSection';
import RecentPostsSection from '@/components/home/RecentPostsSection';
import ResumePreviewSection from '@/components/home/ResumePreviewSection';

export default function HomePage() {
  const recentPosts = getSortedFeedData().slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <RecentPostsSection posts={recentPosts} />
        <ResumePreviewSection />
      </main>
    </>
  );
}
