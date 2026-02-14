'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const queryString = window.location.search;
    const path = queryString ? `${pathname}${queryString}` : pathname;
    trackPageView(path);
  }, [pathname]);

  return null;
}
