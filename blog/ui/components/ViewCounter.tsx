'use client';

import { useEffect, useState } from 'react';
import { getViewCount, trackView } from '@/blog/api/view';

interface ViewCounterProps {
  slug: string;
}

function getSessionKey(slug: string): string {
  return `viewed:${slug}`;
}

function hasTrackedViewInSession(slug: string): boolean {
  try {
    return sessionStorage.getItem(getSessionKey(slug)) === '1';
  } catch {
    return false;
  }
}

function rememberTrackedView(slug: string): void {
  try {
    sessionStorage.setItem(getSessionKey(slug), '1');
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const alreadyTracked = hasTrackedViewInSession(slug);

        const count = alreadyTracked
          ? await getViewCount(slug)
          : await trackView(slug);

        if (!alreadyTracked) {
          rememberTrackedView(slug);
        }

        if (isMounted) {
          setViews(count);
        }
      } catch {
        if (isMounted) {
          setViews(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void init();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const baseStyle = 'inline-flex items-center';

  if (isLoading) {
    return <span className={baseStyle}>조회수를 불러오고 있어요</span>;
  }

  if (views === null) {
    return <span className={baseStyle}>조회수를 준비하고 있어요</span>;
  }

  return (
    <span className={baseStyle}>조회수 {views.toLocaleString('ko-KR')}회</span>
  );
}
