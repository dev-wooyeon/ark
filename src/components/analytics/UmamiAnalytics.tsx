'use client';

import Script from 'next/script';
import { flushQueuedUmamiEvents } from '@/lib/analytics';

const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL;
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function UmamiAnalytics() {
  if (!UMAMI_URL || !UMAMI_WEBSITE_ID) {
    return null;
  }

  return (
    <Script
      src={`${UMAMI_URL}/script.js`}
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
      onLoad={flushQueuedUmamiEvents}
    />
  );
}
