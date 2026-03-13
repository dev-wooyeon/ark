'use client';

import { useEffect, useState } from 'react';
import { getViewCount, trackView } from '@/app/actions/view';

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const sessionKey = `viewed:${slug}`;
        const alreadyTracked = sessionStorage.getItem(sessionKey) === '1';

        const count = alreadyTracked
          ? await getViewCount(slug)
          : await trackView(slug);

        if (!alreadyTracked) {
          sessionStorage.setItem(sessionKey, '1');
        }

        if (isMounted) {
          setViews(count);
        }
      } catch (error) {
        console.error('Failed to load view count:', error);
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
