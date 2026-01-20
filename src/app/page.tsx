import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <div className={styles.header}>
          <span className={styles.flag}>🇰🇷</span>
          <h1 className={styles.siteName}>eunu.log</h1>
        </div>

        <div className={styles.introduction}>
          <p className={styles.bio}>
            Make systems with data,<br />
            currently working <a href="https://981park.com" target="_blank" rel="noopener noreferrer" className={styles.bioLink}>@9.81park</a>
          </p>
        </div>

        <nav className={styles.navigation}>
          <Link href="/posts" className={styles.navLink}>
            Feeds
          </Link>
          <Link href="/resume" className={styles.navLink}>
            Resume
          </Link>
        </nav>
      </main>
    </div>
  );
}
