import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  measurementId?: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const resolvedMeasurementId = measurementId ?? GA_MEASUREMENT_ID;

  if (!resolvedMeasurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${resolvedMeasurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${resolvedMeasurementId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}
