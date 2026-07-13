import type { ReactNode } from 'react';
import ThemeProvider from '@/site/providers/ThemeProvider';
import KBarProvider from '@/search/ui/components/KBarProvider';
import UmamiAnalytics from '@/infra/analytics/components/UmamiAnalytics';
import type { SearchablePost } from '@/search/model/get-search-actions';
import JsonLd from '@/infra/seo/JsonLd';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/site/config/site';

interface AppProvidersProps {
  children: ReactNode;
  posts: SearchablePost[];
}

export default function AppProviders({ children, posts }: AppProvidersProps) {
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
        <KBarProvider posts={posts}>{children}</KBarProvider>
      </ThemeProvider>
    </>
  );
}
