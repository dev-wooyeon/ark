import type { ReactNode } from 'react';
import ThemeProvider from '@/site/providers/ThemeProvider';
import KBarProvider from '@/search/ui/components/KBarProvider';
import UmamiAnalytics from '@/platform/analytics/components/UmamiAnalytics';
import { getSortedFeedData } from '@/blog/services/post-repository';
import JsonLd from '@/platform/seo/JsonLd';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/site/config/site';
import AgentationOverlay from '@/platform/devtools/AgentationOverlay';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  const posts = getSortedFeedData();

  return (
    <>
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
        <KBarProvider posts={posts}>
          {children}
          <AgentationOverlay />
        </KBarProvider>
      </ThemeProvider>
    </>
  );
}
