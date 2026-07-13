import { getSortedFeedData } from '@/blog/services/post-repository';
import HomePageClient from './HomePageClient';

export default function HomePage() {
  const sortedPosts = getSortedFeedData();

  return (
    <main>
      <HomePageClient posts={sortedPosts} />
    </main>
  );
}
