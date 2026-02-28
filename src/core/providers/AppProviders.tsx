import type { ReactNode } from 'react';
import ThemeProvider from '@/shared/providers/ThemeProvider';
import KBarProvider from '@/features/search/ui/components/KBarProvider';
import GoogleAnalytics from '@/shared/analytics/components/GoogleAnalytics';
import UmamiAnalytics from '@/shared/analytics/components/UmamiAnalytics';
import PageViewTracker from '@/shared/analytics/components/PageViewTracker';
import { getSortedFeedData } from '@/features/blog/services/post-repository';
import JsonLd from '@/shared/seo/JsonLd';
import {
  SITE_AUTHOR,
  SITE_NAME,
  SITE_URL,
} from '@/core/config/site';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const posts = getSortedFeedData();
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <>
      <GoogleAnalytics measurementId={gaMeasurementId} />
      <UmamiAnalytics />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          author: {
            '@type': 'Person',
            name: SITE_AUTHOR.name,
            url: SITE_AUTHOR.profileUrl,
            sameAs: SITE_AUTHOR.sameAs,
          },
        }}
      />
      <ThemeProvider>
        <PageViewTracker />
        <KBarProvider posts={posts}>{children}</KBarProvider>
      </ThemeProvider>
    </>
  );
}
