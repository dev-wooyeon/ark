'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useEffectiveMotionMode } from '@/ui/motion/model/motion-mode';
import { THEME_TRANSITION_ORIGIN_EVENT } from '@/ui/ThemeToggle';

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
}

function getDefaultOrigin() {
  if (typeof window === 'undefined') {
    return {
      x: 0,
      y: 0,
    };
  }

  const x = window.innerWidth - 88;
  const y = 46;

  return { x, y };
}

function buildWashBackground(
  theme: 'light' | 'dark',
  originX: number,
  originY: number
): string {
  const anchor = `${originX}px ${originY}px`;

  return theme === 'dark'
    ? `radial-gradient(circle at ${anchor}, rgba(96,165,250,0.24), transparent 46%), linear-gradient(180deg, rgba(15,23,42,0.12), transparent 76%)`
    : `radial-gradient(circle at ${anchor}, rgba(251,191,36,0.2), transparent 46%), linear-gradient(180deg, rgba(255,255,255,0.14), transparent 76%)`;
}

export default function ThemeTransitionWash() {
  const { resolvedTheme } = useTheme();
  const effectiveMotionMode = useEffectiveMotionMode();
  const previousThemeRef = useRef<string | undefined>(undefined);
  const originRef = useRef<{
    x: number;
    y: number;
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

      originRef.current = { x, y, nextTheme };
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
    });

    originRef.current = null;
  }, [effectiveMotionMode, resolvedTheme]);

  if (effectiveMotionMode === 'off') {
    return null;
  }

  const reduced = effectiveMotionMode === 'reduced';
  const duration = reduced ? 0.12 : 0.28;
  const peakOpacity = reduced ? 0.08 : 0.14;

  if (!washState) {
    return null;
  }

  return (
    <motion.div
      key={washState.id}
      className="pointer-events-none fixed inset-0 z-[var(--z-overlay)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, peakOpacity, 0] }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: buildWashBackground(
          washState.theme,
          washState.originX,
          washState.originY
        ),
        willChange: 'opacity',
      }}
      onAnimationComplete={() => setWashState(null)}
    />
  );
}
