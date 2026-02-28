import { Header } from '@/shared/layout';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import HeroSection from '@/features/home/ui/sections/HeroSection';
import RecentPostsSection from '@/features/home/ui/sections/RecentPostsSection';
import ResumePreviewSection from '@/features/home/ui/sections/ResumePreviewSection';

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
