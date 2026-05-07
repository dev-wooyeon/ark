'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useEffectiveMotionMode } from '@/shared/motion/model/motion-mode';
import { THEME_TRANSITION_ORIGIN_EVENT } from '@/shared/ui/ThemeToggle';

interface ThemeOriginDetail {
  x: number;
  y: number;
  nextTheme: 'light' | 'dark';
}

interface WashState {
  id: number;
  theme: 'light' | 'dark';
  originX: number;
  originY: number;
  radius: number;
}

interface WashPhase {
  background: string;
  peakOpacity: number;
}

function getDefaultOrigin() {
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 0,
      radius: 0,
    };
  }

  const x = window.innerWidth - 88;
  const y = 46;
  const radius = Math.hypot(window.innerWidth, window.innerHeight);

  return { x, y, radius };
}

function buildWashPhases(
  theme: 'light' | 'dark',
  originX: number,
  originY: number,
  reduced: boolean
): WashPhase[] {
  const anchor = `${originX}px ${originY}px`;

  const phases =
    theme === 'dark'
      ? [
          {
            background: `radial-gradient(circle at ${anchor}, rgba(251,191,36,0.12), transparent 14%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent 70%)`,
            peakOpacity: 0.07,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(148,163,184,0.18), transparent 22%), linear-gradient(180deg, rgba(148,163,184,0.08), transparent 74%)`,
            peakOpacity: 0.1,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(96,165,250,0.18), transparent 34%), linear-gradient(180deg, rgba(30,41,59,0.1), transparent 76%)`,
            peakOpacity: 0.13,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(49,130,246,0.2), transparent 48%), linear-gradient(180deg, rgba(15,23,42,0.14), transparent 78%)`,
            peakOpacity: 0.11,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(15,23,42,0.18), transparent 58%), linear-gradient(180deg, rgba(2,6,23,0.12), transparent 82%)`,
            peakOpacity: 0.08,
          },
        ]
      : [
          {
            background: `radial-gradient(circle at ${anchor}, rgba(37,99,235,0.12), transparent 14%), linear-gradient(180deg, rgba(15,23,42,0.04), transparent 70%)`,
            peakOpacity: 0.07,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(99,102,241,0.16), transparent 22%), linear-gradient(180deg, rgba(148,163,184,0.06), transparent 74%)`,
            peakOpacity: 0.1,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(226,232,240,0.2), transparent 34%), linear-gradient(180deg, rgba(241,245,249,0.12), transparent 76%)`,
            peakOpacity: 0.13,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(251,191,36,0.18), transparent 48%), linear-gradient(180deg, rgba(255,255,255,0.12), transparent 78%)`,
            peakOpacity: 0.11,
          },
          {
            background: `radial-gradient(circle at ${anchor}, rgba(255,255,255,0.18), transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.08), transparent 82%)`,
            peakOpacity: 0.08,
          },
        ];

  return reduced ? phases.slice(1, 4) : phases;
}

export default function ThemeTransitionWash() {
  const { resolvedTheme } = useTheme();
  const effectiveMotionMode = useEffectiveMotionMode();
  const previousThemeRef = useRef<string | undefined>(undefined);
  const originRef = useRef<{
    x: number;
    y: number;
    radius: number;
    nextTheme: 'light' | 'dark';
  } | null>(null);
  const [washState, setWashState] = useState<WashState | null>(null);

  useEffect(() => {
    const handleOrigin = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeOriginDetail>;
      const { x, y, nextTheme } = customEvent.detail;

      if (
        typeof x !== 'number' ||
        typeof y !== 'number' ||
        (nextTheme !== 'light' && nextTheme !== 'dark')
      ) {
        return;
      }

      const radius = Math.max(
        Math.hypot(x, y),
        Math.hypot(window.innerWidth - x, y),
        Math.hypot(x, window.innerHeight - y),
        Math.hypot(window.innerWidth - x, window.innerHeight - y)
      );

      originRef.current = { x, y, radius, nextTheme };
    };

    window.addEventListener(
      THEME_TRANSITION_ORIGIN_EVENT,
      handleOrigin as EventListener
    );

    return () => {
      window.removeEventListener(
        THEME_TRANSITION_ORIGIN_EVENT,
        handleOrigin as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    const previousTheme = previousThemeRef.current;
    previousThemeRef.current = resolvedTheme;

    if (!previousTheme || previousTheme === resolvedTheme) {
      return;
    }

    if (effectiveMotionMode === 'off') {
      return;
    }

    const fallbackOrigin = getDefaultOrigin();
    const storedOrigin = originRef.current;
    const nextTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
    const shouldUseStoredOrigin = storedOrigin?.nextTheme === nextTheme;

    setWashState({
      id: Date.now(),
      theme: nextTheme,
      originX: shouldUseStoredOrigin ? storedOrigin.x : fallbackOrigin.x,
      originY: shouldUseStoredOrigin ? storedOrigin.y : fallbackOrigin.y,
      radius: shouldUseStoredOrigin ? storedOrigin.radius : fallbackOrigin.radius,
    });

    originRef.current = null;
  }, [effectiveMotionMode, resolvedTheme]);

  if (effectiveMotionMode === 'off') {
    return null;
  }

  const reduced = effectiveMotionMode === 'reduced';
  const phases =
    washState === null
      ? []
      : buildWashPhases(
          washState.theme,
          washState.originX,
          washState.originY,
          reduced
        );
  const phaseDuration = reduced ? 0.24 : 0.48;
  const phaseDelay = reduced ? 0.06 : 0.14;

  return (
    <AnimatePresence>
      {washState ? (
        <motion.div
          key={washState.id}
          className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onAnimationComplete={() => setWashState(null)}
        >
          {phases.map((phase, index) => (
            <motion.div
              key={`${washState.id}-${index}`}
              className="absolute inset-0"
              initial={{
                opacity: 0,
                clipPath: `circle(18px at ${washState.originX}px ${washState.originY}px)`,
              }}
              animate={{
                opacity: [0, phase.peakOpacity, phase.peakOpacity * 0.62, 0],
                clipPath: [
                  `circle(18px at ${washState.originX}px ${washState.originY}px)`,
                  `circle(${washState.radius * 0.38}px at ${washState.originX}px ${washState.originY}px)`,
                  `circle(${washState.radius * 0.78}px at ${washState.originX}px ${washState.originY}px)`,
                  `circle(${washState.radius}px at ${washState.originX}px ${washState.originY}px)`,
                ],
              }}
              transition={{
                duration: phaseDuration,
                delay: index * phaseDelay,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ background: phase.background }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
