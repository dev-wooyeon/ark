import type { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, createSiteUrl } from '@/site/config/site';

export const dynamic = 'force-dynamic';

const homeUrl = createSiteUrl();

export const metadata: Metadata = {
  alternates: {
    canonical: homeUrl,
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: homeUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export { default } from '@/site/home/ui/pages/HomePage';
