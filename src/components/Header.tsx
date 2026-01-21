'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          eunu.log
        </Link>
        <ul className={styles.navList}>
          <li>
            <Link href="/feed" className={styles.navLink}>
              Feed
            </Link>
          </li>
          <li>
            <Link href="/resume" className={styles.navLink}>
              Resume
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
