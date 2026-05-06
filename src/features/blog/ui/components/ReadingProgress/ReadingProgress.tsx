'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffectiveMotionMode } from '@/shared/motion/model/motion-mode';

export default function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const effectiveMotionMode = useEffectiveMotionMode();
  const { scrollYProgress } = useScroll();
  const smoothScaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX =
    effectiveMotionMode === 'full' ? smoothScaleX : scrollYProgress;
  const opacityTransitionDuration =
    effectiveMotionMode === 'off'
      ? 0
      : effectiveMotionMode === 'reduced'
        ? 0.08
        : 0.2;

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-grey-100)] z-[var(--z-sticky)] origin-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: opacityTransitionDuration }}
    >
      <motion.div
        className="h-full bg-[var(--color-toss-blue)] origin-left"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
