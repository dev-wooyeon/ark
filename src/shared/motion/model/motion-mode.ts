'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

export type MotionMode = 'auto' | 'reduced' | 'off';
export type EffectiveMotionMode = 'full' | 'reduced' | 'off';

export const MOTION_MODE_STORAGE_KEY = 'eunulog:motion-mode';
export const MOTION_MODE_CHANGED_EVENT = 'eunulog:motion-mode-changed';

const DEFAULT_MOTION_MODE: MotionMode = 'auto';

function isMotionMode(value: string): value is MotionMode {
  return value === 'auto' || value === 'reduced' || value === 'off';
}

function getSystemPrefersReducedMotion(): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readStoredMotionMode(): MotionMode {
  if (typeof window === 'undefined') {
    return DEFAULT_MOTION_MODE;
  }

  try {
    const storedMode = window.localStorage.getItem(MOTION_MODE_STORAGE_KEY);
    if (storedMode && isMotionMode(storedMode)) {
      return storedMode;
    }
  } catch {
    // Storage access can fail in private contexts; fall back safely.
  }

  return DEFAULT_MOTION_MODE;
}

function writeStoredMotionMode(mode: MotionMode): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(MOTION_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures and keep runtime state only.
  }

  window.dispatchEvent(
    new CustomEvent(MOTION_MODE_CHANGED_EVENT, {
      detail: mode,
    })
  );
}

export function resolveEffectiveMotionMode(
  motionMode: MotionMode,
  prefersReducedMotion: boolean
): EffectiveMotionMode {
  if (motionMode === 'off') {
    return 'off';
  }

  if (motionMode === 'reduced') {
    return 'reduced';
  }

  return prefersReducedMotion ? 'reduced' : 'full';
}

export interface UseMotionModeResult {
  motionMode: MotionMode;
  effectiveMotionMode: EffectiveMotionMode;
  prefersReducedMotion: boolean;
  isInitialized: boolean;
  setMotionMode: (motionMode: MotionMode) => void;
}

export function useMotionMode(): UseMotionModeResult {
  const [motionMode, setMotionModeState] =
    useState<MotionMode>(DEFAULT_MOTION_MODE);
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    setMotionModeState(readStoredMotionMode());
    const hasMatchMedia =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function';
    const mediaQuery = hasMatchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    const updateMedia = (event?: MediaQueryListEvent) => {
      if (!mediaQuery) {
        setPrefersReducedMotion(false);
        return;
      }

      setPrefersReducedMotion(event?.matches ?? mediaQuery.matches);
    };

    const handleModeChanged = (event: Event) => {
      const customEvent = event as CustomEvent<MotionMode>;
      if (customEvent.detail && isMotionMode(customEvent.detail)) {
        setMotionModeState(customEvent.detail);
        return;
      }

      setMotionModeState(readStoredMotionMode());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MOTION_MODE_STORAGE_KEY) {
        setMotionModeState(readStoredMotionMode());
      }
    };

    updateMedia();

    if (mediaQuery) {
      mediaQuery.addEventListener('change', updateMedia);
    }

    window.addEventListener(MOTION_MODE_CHANGED_EVENT, handleModeChanged);
    window.addEventListener('storage', handleStorage);
    setIsInitialized(true);

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', updateMedia);
      }
      window.removeEventListener(MOTION_MODE_CHANGED_EVENT, handleModeChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setMotionMode = useCallback((nextMode: MotionMode) => {
    setMotionModeState(nextMode);
    writeStoredMotionMode(nextMode);
  }, []);

  const effectiveMotionMode = useMemo(
    () => resolveEffectiveMotionMode(motionMode, prefersReducedMotion),
    [motionMode, prefersReducedMotion]
  );

  return {
    motionMode,
    effectiveMotionMode,
    prefersReducedMotion,
    isInitialized,
    setMotionMode,
  };
}

export function useEffectiveMotionMode(
  modeOverride?: MotionMode
): EffectiveMotionMode {
  const { motionMode, prefersReducedMotion } = useMotionMode();
  const mode = modeOverride ?? motionMode;

  return useMemo(
    () => resolveEffectiveMotionMode(mode, prefersReducedMotion),
    [mode, prefersReducedMotion]
  );
}

export function getNextMotionMode(current: MotionMode): MotionMode {
  if (current === 'auto') {
    return 'reduced';
  }

  if (current === 'reduced') {
    return 'off';
  }

  return 'auto';
}
