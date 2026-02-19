'use client';

import { useEffect, useRef, useState } from 'react';

export interface VisibilityState {
  topHeaderVisible: boolean;
  bottomBarVisible: boolean;
}

const HOME_NAV_REVEAL_STORAGE_KEY = 'home_mobile_bottom_nav_revealed';
const HOME_NAV_REVEAL_SCROLL_Y = 32;

const INITIAL_VISIBILITY: VisibilityState = {
  topHeaderVisible: true,
  bottomBarVisible: true,
};

export function isBlogPostPath(pathname: string): boolean {
  return /^\/blog\/[^/]+$/.test(pathname);
}

export function useScrollVisibility(pathname: string): VisibilityState {
  const [visibility, setVisibility] =
    useState<VisibilityState>(INITIAL_VISIBILITY);
  const visibilityRef = useRef<VisibilityState>(INITIAL_VISIBILITY);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const isHomePath = pathname === '/';
    const shouldHideBottomOnScroll = isBlogPostPath(pathname);
    let isHomeBottomNavRevealed = false;
    let lastScrollY = window.scrollY;

    try {
      isHomeBottomNavRevealed =
        window.sessionStorage.getItem(HOME_NAV_REVEAL_STORAGE_KEY) === '1';
    } catch {
      isHomeBottomNavRevealed = false;
    }

    const updateVisibility = (next: VisibilityState) => {
      if (
        visibilityRef.current.topHeaderVisible === next.topHeaderVisible &&
        visibilityRef.current.bottomBarVisible === next.bottomBarVisible
      ) {
        return;
      }

      visibilityRef.current = next;
      setVisibility(next);
    };

    const resolveHomeBottomVisibility = (currentScrollY: number) => {
      if (!isHomePath) {
        return null;
      }

      if (isHomeBottomNavRevealed) {
        return true;
      }

      if (currentScrollY >= HOME_NAV_REVEAL_SCROLL_Y) {
        isHomeBottomNavRevealed = true;

        try {
          window.sessionStorage.setItem(HOME_NAV_REVEAL_STORAGE_KEY, '1');
        } catch {
          // Intentionally ignore storage failures (private mode or restrictions).
        }

        return true;
      }

      return false;
    };

    const showAll = () => {
      const homeBottomVisible = resolveHomeBottomVisibility(window.scrollY);

      updateVisibility({
        topHeaderVisible: true,
        bottomBarVisible: homeBottomVisible ?? true,
      });
    };

    showAll();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!mediaQuery.matches) {
        lastScrollY = currentScrollY;
        showAll();
        return;
      }

      if (currentScrollY <= 12) {
        lastScrollY = currentScrollY;
        const homeBottomVisible = resolveHomeBottomVisibility(currentScrollY);
        updateVisibility({
          topHeaderVisible: true,
          bottomBarVisible: homeBottomVisible ?? true,
        });
        return;
      }

      const homeBottomVisible = resolveHomeBottomVisibility(currentScrollY);
      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) < 6) {
        if (
          homeBottomVisible !== null &&
          homeBottomVisible !== visibilityRef.current.bottomBarVisible
        ) {
          updateVisibility({
            ...visibilityRef.current,
            bottomBarVisible: homeBottomVisible,
          });
        }
        return;
      }

      const scrollingDown = delta > 0;
      const bottomBarVisible =
        homeBottomVisible ?? (shouldHideBottomOnScroll ? !scrollingDown : true);

      updateVisibility({
        topHeaderVisible: !scrollingDown,
        bottomBarVisible,
      });

      lastScrollY = currentScrollY;
    };

    const handleResize = () => {
      if (!mediaQuery.matches) {
        showAll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]);

  return visibility;
}
