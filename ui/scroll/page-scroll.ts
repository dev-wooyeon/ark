'use client';

const DESKTOP_SCROLL_MEDIA_QUERY = '(min-width: 768px)';
const PAGE_SCROLL_CONTAINER_SELECTOR = '[data-page-scroll-container]';

type PageScrollTarget = Window | HTMLElement;

export interface PageScrollSnapshot {
  scrollTop: number;
  scrollableDistance: number;
  progress: number;
}

type PageScrollListener = (snapshot: PageScrollSnapshot) => void;

function resolveScrollTarget(isDesktop: boolean): PageScrollTarget {
  if (!isDesktop) {
    return window;
  }

  const container = document.querySelector<HTMLElement>(
    PAGE_SCROLL_CONTAINER_SELECTOR
  );

  if (!container) {
    return window;
  }

  return container.dataset.pageScrollMode === 'document' ? window : container;
}

function readScrollSnapshot(target: PageScrollTarget): PageScrollSnapshot {
  const isWindow = target === window;
  const element = target as HTMLElement;
  const scrollTop = isWindow ? window.scrollY : element.scrollTop;
  const scrollHeight = isWindow
    ? document.documentElement.scrollHeight
    : element.scrollHeight;
  const viewportHeight = isWindow ? window.innerHeight : element.clientHeight;
  const scrollableDistance = Math.max(0, scrollHeight - viewportHeight);
  const progress =
    scrollableDistance === 0
      ? 0
      : Math.min(1, Math.max(0, scrollTop / scrollableDistance));

  return {
    scrollTop,
    scrollableDistance,
    progress,
  };
}

export function observePageScroll(listener: PageScrollListener): () => void {
  const desktopMediaQuery = window.matchMedia(DESKTOP_SCROLL_MEDIA_QUERY);
  let target = resolveScrollTarget(desktopMediaQuery.matches);

  const emitSnapshot = () => {
    listener(readScrollSnapshot(target));
  };

  const connectTarget = () => {
    target.removeEventListener('scroll', emitSnapshot);
    target = resolveScrollTarget(desktopMediaQuery.matches);
    target.addEventListener('scroll', emitSnapshot, { passive: true });
    emitSnapshot();
  };

  target.addEventListener('scroll', emitSnapshot, { passive: true });
  desktopMediaQuery.addEventListener('change', connectTarget);
  emitSnapshot();

  return () => {
    target.removeEventListener('scroll', emitSnapshot);
    desktopMediaQuery.removeEventListener('change', connectTarget);
  };
}
