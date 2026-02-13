'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const targetPath = query ? `${pathname}?${query}` : pathname;
    trackPageView(targetPath);
  }, [pathname, searchParams]);

  return null;
}
