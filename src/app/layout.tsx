import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'eunu.log',
  description: 'Personal blog',
  keywords: ['Frontend', 'React', 'Next.js', 'TypeScript', 'Tech Blog'],
  authors: [{ name: 'Eunu' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://eunu.log',
    title: 'eunu.log',
    description: 'Personal blog',
    siteName: 'eunu.log',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
