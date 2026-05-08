import { beforeEach, describe, expect, it, vi } from 'vitest';

interface AnalyticsModule {
  trackEvent: (eventName: string, params?: Record<string, unknown>) => void;
  flushQueuedUmamiEvents: () => void;
}

async function loadAnalytics(): Promise<AnalyticsModule> {
  vi.resetModules();
  return (await import('./analytics')) as AnalyticsModule;
}

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
  (window as Window).umami = undefined;
});

describe('analytics', () => {
  it('queues umami events until tracker is ready and flushes on demand', async () => {
    const analytics = await loadAnalytics();
    const umamiTrack = vi.fn();

    analytics.trackEvent('post_view', {
      post_slug: 'cold-start',
    });

    expect(umamiTrack).not.toHaveBeenCalled();

    (window as Window).umami = {
      track: umamiTrack,
    };

    analytics.flushQueuedUmamiEvents();

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith('post_view', {
      post_slug: 'cold-start',
    });
  });

  it('flushes queued umami events before sending the current event', async () => {
    const analytics = await loadAnalytics();
    const umamiTrack = vi.fn();

    analytics.trackEvent('queued_event', {
      source: 'pre-init',
    });

    (window as Window).umami = {
      track: umamiTrack,
    };

    analytics.trackEvent('live_event', {
      source: 'post-init',
    });

    expect(umamiTrack).toHaveBeenCalledTimes(2);
    expect(umamiTrack).toHaveBeenNthCalledWith(1, 'queued_event', {
      source: 'pre-init',
    });
    expect(umamiTrack).toHaveBeenNthCalledWith(2, 'live_event', {
      source: 'post-init',
    });
  });

  it('sends events immediately when umami is ready', async () => {
    const analytics = await loadAnalytics();
    const umamiTrack = vi.fn();
    (window as Window).umami = { track: umamiTrack };

    analytics.trackEvent('cta_click', { source: 'hero' });

    expect(umamiTrack).toHaveBeenCalledTimes(1);
    expect(umamiTrack).toHaveBeenCalledWith('cta_click', {
      source: 'hero',
    });
  });
});
