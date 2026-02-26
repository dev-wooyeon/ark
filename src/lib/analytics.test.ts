import { beforeEach, describe, expect, it, vi } from 'vitest';

interface AnalyticsModule {
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  trackPageView: (path: string) => void;
}

function setTrackingEnv(measurementId: string | undefined) {
  if (measurementId === undefined) {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  } else {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = measurementId;
  }
}

async function loadAnalytics(): Promise<AnalyticsModule> {
  vi.resetModules();
  return (await import('./analytics')) as Promise<AnalyticsModule>;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  setTrackingEnv(undefined);
  window.history.replaceState({}, '', '/');
  (window as Window).gtag = undefined;
});

describe('analytics', () => {
  it('does not emit event when GA measurement id is missing', async () => {
    const analytics = await loadAnalytics();
    const spy = vi.fn();
    (window as Window).gtag = spy;

    analytics.trackEvent('click', { target: 'nav' });

    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit page view when GA measurement id is missing', async () => {
    const analytics = await loadAnalytics();
    const spy = vi.fn();
    (window as Window).gtag = spy;

    analytics.trackPageView('/blog');

    expect(spy).not.toHaveBeenCalled();
  });

  it('does not emit event when gtag function does not exist', async () => {
    const analytics = await loadAnalytics();
    setTrackingEnv('G-TEST-ONLY');

    analytics.trackEvent('click', { target: 'missing_gtag' });

    expect(window.gtag).toBeUndefined();
  });

  it('sends click event when tracking env and gtag are available', async () => {
    const spy = vi.fn();
    setTrackingEnv('G-TEST-ONLY');
    const analytics = await loadAnalytics();
    (window as Window).gtag = spy;

    analytics.trackEvent('search', {
      q: 'eunu.log',
      index: 1,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('event', 'search', {
      q: 'eunu.log',
      index: 1,
    });
  });

  it('sends page_view with title, location, and path', async () => {
    const spy = vi.fn();
    setTrackingEnv('G-TEST-ONLY');
    const analytics = await loadAnalytics();
    (window as Window).gtag = spy;
    document.title = 'Blog';
    window.history.replaceState({}, '', '/blog?source=unit');

    analytics.trackPageView('/blog');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/blog',
      page_title: 'Blog',
      page_location: window.location.href,
    });
  });

  it('accepts custom string event names without throwing', async () => {
    const spy = vi.fn();
    setTrackingEnv('G-TEST-ONLY');
    const analytics = await loadAnalytics();
    (window as Window).gtag = spy;

    analytics.trackEvent('cta_click', { source: 'hero' });

    expect(spy).toHaveBeenCalledWith('event', 'cta_click', {
      source: 'hero',
    });
  });
});
