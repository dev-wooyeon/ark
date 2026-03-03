'use client';

import { motion } from 'framer-motion';
import { AnalyticsEvents, trackEvent } from '@/shared/analytics/lib/analytics';
import {
  getNextMotionMode,
  type MotionMode,
  useMotionMode,
} from '@/shared/motion/model/motion-mode';

const modeLabel: Record<MotionMode, string> = {
  auto: '자동',
  reduced: '축소',
  off: '끔',
};

const nextModeLabel: Record<MotionMode, string> = {
  auto: '축소',
  reduced: '끔',
  off: '자동',
};

const modeIcon: Record<MotionMode, string> = {
  auto: 'A',
  reduced: 'R',
  off: 'O',
};

export default function MotionModeToggle() {
  const { motionMode, effectiveMotionMode, setMotionMode } = useMotionMode();

  const handleToggle = () => {
    const nextMode = getNextMotionMode(motionMode);

    setMotionMode(nextMode);
    trackEvent(AnalyticsEvents.motion, {
      from_mode: motionMode,
      to_mode: nextMode,
      effective_mode: effectiveMotionMode,
      surface: 'header',
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--color-grey-600)] hover:bg-[var(--color-grey-100)] hover:text-[var(--color-grey-800)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-toss-blue)]"
      aria-label={`모션 모드 ${modeLabel[motionMode]} (다음: ${nextModeLabel[motionMode]})`}
      title={`모션: ${modeLabel[motionMode]} (${nextModeLabel[motionMode]}으로 변경)`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--color-grey-300)] bg-[var(--color-bg-primary)] text-[10px] font-bold"
      >
        {modeIcon[motionMode]}
      </span>
      <span className="hidden lg:inline">모션 {modeLabel[motionMode]}</span>
    </motion.button>
  );
}
