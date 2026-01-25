import Link from 'next/link';
import { getSortedFeedData } from '@/lib/feeds';
import FeedList from '@/components/features/feed/FeedList';
import styles from './page.module.css';

export default function FeedPage() {
  const allFeedData = getSortedFeedData();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>← Home</Link>
        <h1 className={styles.title}>Feed</h1>
      </header>

      <main className={styles.main}>
        <FeedList feed={allFeedData} />
      </main>
    </div>
  );
}
