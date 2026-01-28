import { getSortedFeedData } from '@/lib/mdx-feeds';
import FeedList from './_components/FeedList';
import { PageLayout } from '../_components/PageLayout';

export default function FeedPage() {
  const allFeedData = getSortedFeedData();

  return (
    <PageLayout title="Feed">
      <FeedList feed={allFeedData} />
    </PageLayout>
  );
}
