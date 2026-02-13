export const AnalyticsEvents = {
  view: 'view',
  click: 'click',
  search: 'search',
  error: 'error',
  theme: 'theme',
} as const;

export type AnalyticsEventName =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsParams = Record<string, AnalyticsPrimitive | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function getTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getDevice(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';
}

function getCommonParams(): AnalyticsParams {
  if (typeof window === 'undefined') {
    return {};
  }

  return {
    page_path: window.location.pathname,
    device: getDevice(),
    theme: getTheme(),
  };
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsParams = {}
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, {
    ...getCommonParams(),
    ...params,
  });
}

export function trackPageView(pathname: string) {
  trackEvent(AnalyticsEvents.view, {
    page_path: pathname,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  });
}
