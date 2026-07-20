import type { Metadata } from 'next';
import { SITE_NAME, createSiteUrl } from '@/site/config/site';

const homeUrl = createSiteUrl();
const homeDescription =
  'Building backend systems with less complexity and more trust.';

export const metadata: Metadata = {
  alternates: {
    canonical: homeUrl,
  },
  openGraph: {
    title: SITE_NAME,
    description: homeDescription,
    url: homeUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: homeDescription,
  },
};

export { default } from '@/site/home/ui/pages/HomePage';
