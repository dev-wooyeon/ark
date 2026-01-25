"use client";

import Link from 'next/link';
import TypingAnimation from '@/components/features/animation/TypingAnimation';
import styles from './page.module.css';
import AmbientBackground from '@/components/layout/AmbientBackground';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for "sophisticated" feel
      },
    },
  };

  return (
    <div className={styles.container}>
      <AmbientBackground />

      <motion.main
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <span className={styles.flag}>🇰🇷</span>
          <h1 className={styles.siteName}>enun.log</h1>
        </motion.div>

        <motion.div className={styles.introduction} variants={itemVariants}>
          <div className={styles.bio}>
            <TypingAnimation
              texts={['Make Data, System, Creative Things. Currently working as a Software Engineer @9.81park']}
              speed={20}
              linkPatterns={[{ pattern: '@9.81park', url: 'https://981park.com' }]}
            />
          </div>
        </motion.div>

        <motion.nav className={styles.navigation} variants={itemVariants}>
          <Link href="/feed" className={styles.navLink}>
            Feed
          </Link>
          <Link href="/resume" className={styles.navLink}>
            Resume
          </Link>
        </motion.nav>
      </motion.main>
    </div>
  );
}
