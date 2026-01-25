'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.copyright}>
          © {currentYear} eunu.log. All rights reserved.
        </div>
        <div className={styles.links}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.link}>
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
