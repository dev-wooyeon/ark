'use client';

import { useEffect, useRef, useState } from 'react';

export interface VisibilityState {
  topHeaderVisible: boolean;
  bottomBarVisible: boolean;
}

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
    const shouldHideBottomOnScroll = isBlogPostPath(pathname);
    let lastScrollY = window.scrollY;

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

    const showAll = () => {
      updateVisibility({
        topHeaderVisible: true,
        bottomBarVisible: true,
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
        showAll();
        return;
      }

      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) < 6) {
        return;
      }

      const scrollingDown = delta > 0;

      updateVisibility({
        topHeaderVisible: !scrollingDown,
        bottomBarVisible: shouldHideBottomOnScroll ? !scrollingDown : true,
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
