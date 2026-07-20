import type { Metadata } from 'next';
import ArchivePage from '@/site/archive/ui/pages/ArchivePage';
import { createSiteUrl } from '@/site/config/site';

const archiveUrl = createSiteUrl('/archive');

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Ark에 쌓인 기술과 삶의 기록',
  alternates: {
    canonical: archiveUrl,
  },
  openGraph: {
    title: 'Archive',
    description: 'Ark에 쌓인 기술과 삶의 기록',
    url: archiveUrl,
  },
};

export default ArchivePage;
