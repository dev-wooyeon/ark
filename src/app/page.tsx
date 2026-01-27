"use client";

import Link from 'next/link';
import styles from '@/styles/pages.module.css';
import TypingAnimation from '@/app/_components/TypingAnimation';

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
            <TypingAnimation
              texts={[
                'Make <span class="' + styles.highlight + '">Data</span>, <span class="' + styles.highlight + '">System</span>, <span class="' + styles.highlight + '">Creative</span> Things. Currently working as a Software Engineer <a href="https://981park.com" class="' + styles.bioLink + '" target="_blank" rel="noopener noreferrer">@9.81park</a>.'
              ]}
              speed={15}
              linkPatterns={[]}
            />
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
