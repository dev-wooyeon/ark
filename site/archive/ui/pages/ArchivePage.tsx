import { getSortedFeedData } from '@/blog/services/post-repository';
import { PostList } from '@/blog/ui/components';

export default function ArchivePage() {
  return (
    <main>
      <section aria-label="글 아카이브" className="pt-3">
        <PostList posts={getSortedFeedData()} layout="archive" />
      </section>
    </main>
  );
}
