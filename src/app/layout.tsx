import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://eunu.log'),
  title: {
    default: 'eunu.log',
    template: '%s | eunu.log',
  },
  description: '데이터와 시스템, 창의적인 것들을 만듭니다',
  authors: [{ name: 'Eunu' }],
  keywords: ['개발', '블로그', '기술', 'Next.js', 'React'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://eunu.log',
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
        <div id="app-root">{children}</div>
        <div id="overlay-root" />
      </body>
    </html>
  );
}
