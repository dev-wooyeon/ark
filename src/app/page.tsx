"use client";

import Link from 'next/link';
import styles from '@/styles/pages.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftSection}>
        <div>
          <span className={styles.prefix}>🇰🇷</span>
          <h1 className={styles.siteName}>eunu.log</h1>
        </div>
        <section className={styles.bioSection}>
          <p className={styles.bio}>
            Make <span className={styles.highlight}>Data</span>, <span className={styles.highlight}>System</span>, <span className={styles.highlight}>Creative</span> Things. Currently working as a Software Engineer <Link href="https://981park.com" className={styles.bioLink} target="_blank" rel="noopener noreferrer">@9.81park</Link>.
          </p>
        </section>
      </div>
      <div className={styles.rightSection}>
        <section className={styles.navigation}>
          <Link href="/feed" className={styles.navLink}>
            Feed
          </Link>
          <Link href="/resume" className={styles.navLink}>
            Resume
          </Link>
        </section>
      </div>
    </div>
  );
}
