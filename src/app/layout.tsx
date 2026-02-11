import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/tossface.css';

import JsonLd from '@/components/seo/JsonLd';
import ThemeProvider from '@/components/providers/ThemeProvider';
import KBarProvider from '@/components/providers/KBarProvider';
import { getSortedFeedData } from '@/lib/mdx-feeds';

export const metadata: Metadata = {
  metadataBase: new URL('https://eunu-log.vercel.app'),
  title: {
    default: 'eunu.log',
    template: '%s | eunu.log',
  },
  description: '데이터와 시스템, 창의적인 것들을 만듭니다',
  authors: [{ name: 'dev-wooyeon' }],
  keywords: ['개발', '블로그', '기술', 'Next.js', 'React'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://eunu-log.vercel.app',
    title: 'eunu.log',
    description: '데이터와 시스템, 창의적인 것들을 만듭니다',
    siteName: 'eunu.log',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'eunu.log',
    description: '데이터와 시스템, 창의적인 것들을 만듭니다',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'Lg-je4JjsFWeaBipKGX15JV1fsHCuM7LCmsmGCvnXiU',
    other: {
      'naver-site-verification': '94f6667c9c4ccb0b226ca6cea419f584bc0f5043',
    },
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get all posts for search
  const posts = getSortedFeedData();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <KBarProvider posts={posts}>
            <div id="app-root">{children}</div>
            <div id="overlay-root" />
          </KBarProvider>
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'eunu.log',
              url: 'https://eunu-log.vercel.app',
              author: {
                '@type': 'Person',
                name: 'Eunu',
                url: 'https://eunu-log.vercel.app/resume',
                sameAs: [
                  'https://github.com/dev-wooyeon',
                  'mailto:une@kakao.com',
                ],
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
