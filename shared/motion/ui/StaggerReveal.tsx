'use client';

import { Children, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useEffectiveMotionMode } from '@/shared/motion/model/motion-mode';

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  stagger?: number;
}

export default function StaggerReveal({
  children,
  className,
  itemClassName,
  stagger = 0.08,
}: StaggerRevealProps) {
  const effectiveMotionMode = useEffectiveMotionMode();
  const items = Children.toArray(children);
  const shouldAnimate = effectiveMotionMode !== 'off';
  const shouldTranslate = effectiveMotionMode === 'full';

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: effectiveMotionMode === 'reduced' ? 0.03 : stagger,
          },
        },
      }}
    >
      {items.map((child, index) => (
        <motion.div
          key={index}
          className={itemClassName}
          variants={{
            hidden: {
              opacity: 0,
              y: shouldTranslate ? 18 : 0,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: effectiveMotionMode === 'reduced' ? 0.18 : 0.34,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export type { StaggerRevealProps };
