import Link from 'next/link';
import TypingAnimation from '@/components/TypingAnimation';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.header}>
          <span className={styles.flag}>🇰🇷</span>
          <h1 className={styles.siteName}>enun.log</h1>
        </div>

        <div className={styles.introduction}>
          <p className={styles.bio}>
            <TypingAnimation
              texts={['Make Data, System, Createive Things. Currently working as a Software Engineer @9.81park']}
              speed={20}
              linkPatterns={[{ pattern: '@9.81park', url: 'https://981park.com' }]}
            />
          </p>
        </div>

        <nav className={styles.navigation}>
          <Link href="/feed" className={styles.navLink}>
            Feed
          </Link>
          <Link href="/resume" className={styles.navLink}>
            Resume
          </Link>
        </nav>
      </main>
    </div>
  );
}
