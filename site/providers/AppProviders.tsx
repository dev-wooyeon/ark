import type { ReactNode } from 'react';
import UmamiAnalytics from '@/infra/analytics/components/UmamiAnalytics';
import JsonLd from '@/infra/seo/JsonLd';
import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '@/site/config/site';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
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
      {children}
    </>
  );
}
