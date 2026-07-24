'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffectiveMotionMode } from '@/ui/motion/model/motion-mode';
import { observePageScroll } from '@/ui/scroll/page-scroll';

export default function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const effectiveMotionMode = useEffectiveMotionMode();
  const scrollProgress = useMotionValue(0);
  const smoothScaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = effectiveMotionMode === 'full' ? smoothScaleX : scrollProgress;
  const opacityTransitionDuration =
    effectiveMotionMode === 'off'
      ? 0
      : effectiveMotionMode === 'reduced'
        ? 0.08
        : 0.2;

  useEffect(() => {
    return observePageScroll(({ progress, scrollTop }) => {
      scrollProgress.set(progress);
      setIsVisible(scrollTop > 200);
    });
  }, [scrollProgress]);

  return (
    <motion.div
      data-reading-progress
      className="fixed top-0 left-0 right-0 h-1 bg-[var(--color-grey-100)] z-[var(--z-sticky)] origin-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: opacityTransitionDuration }}
    >
      <motion.div
        data-reading-progress-bar
        className="h-full bg-[var(--color-accent)] origin-left"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
