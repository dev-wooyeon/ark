export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type GtagValue = string | number | boolean | undefined;
type GtagParams = Record<string, GtagValue>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function canTrack(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(GA_MEASUREMENT_ID) &&
    typeof window.gtag === 'function'
  );
}

export function trackPageView(path: string): void {
  if (!canTrack()) return;

  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, params: GtagParams = {}): void {
  if (!canTrack()) return;

  window.gtag?.('event', eventName, params);
}

