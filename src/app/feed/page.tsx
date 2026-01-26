import Link from 'next/link';
import { getSortedFeedData } from '@/lib/feeds';
import FeedList from './_components/FeedList';
import styles from '@/styles/pages.module.css';

export default function FeedPage() {
  const allFeedData = getSortedFeedData();

  return (
    <div className={styles.feedContainer}>
      <header className={styles.feedHeader}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.pageTitle}>Feed</h1>
      </header>

      <main className={styles.feedMain}>
        <FeedList feed={allFeedData} />
      </main>
    </div>
  );
}
