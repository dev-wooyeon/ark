import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import '@/styles/tossface.css';
import IntroSplash from '@/components/layout/IntroSplash';
import JsonLd from '@/components/seo/JsonLd';

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
    google: 'GOOGLE_VERIFICATION_CODE_PLACEHOLDER',
    other: {
      'naver-site-verification': 'NAVER_VERIFICATION_CODE_PLACEHOLDER',
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
  return (
    <html lang="ko">
      <body>
        <IntroSplash />
        <div id="app-root">{children}</div>
        <div id="overlay-root" />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'eunu.log',
            url: 'https://eunu.log',
            author: {
              '@type': 'Person',
              name: 'Eunu',
              url: 'https://eunu.log/resume',
              sameAs: [
                'https://github.com/dev-wooyeon',
                'mailto:contact@une@kakao.com'
              ]
            },
          }}
        />
      </body>
    </html>
  );
}
