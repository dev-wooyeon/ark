export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const AnalyticsEvents = {
  view: 'view',
  click: 'click',
  search: 'search',
  error: 'error',
  theme: 'theme',
} as const;

export type AnalyticsEventName =
  | (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]
  | (string & {});

type GtagValue = string | number | boolean | null | undefined;
type GtagParams = Record<string, GtagValue>;
type UmamiParams = Record<string, unknown>;

interface QueuedUmamiEvent {
  eventName: AnalyticsEventName;
  params: UmamiParams;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    umami?: {
      track: (
        eventNameOrCallback:
          | string
          | ((props: Record<string, unknown>) => Record<string, unknown>),
        eventData?: Record<string, unknown>
      ) => void;
    };
  }
}

function canTrackGA(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean(GA_MEASUREMENT_ID) &&
    typeof window.gtag === 'function'
  );
}

function canTrackUmami(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.umami?.track === 'function'
  );
}

const umamiEventQueue: QueuedUmamiEvent[] = [];

function enqueueUmamiEvent(
  eventName: AnalyticsEventName,
  params: UmamiParams
): void {
  umamiEventQueue.push({ eventName, params });
}

export function flushQueuedUmamiEvents(): void {
  if (!canTrackUmami() || umamiEventQueue.length === 0) {
    return;
  }

  while (umamiEventQueue.length > 0) {
    const queuedEvent = umamiEventQueue.shift();

    if (!queuedEvent) {
      break;
    }

    window.umami?.track(queuedEvent.eventName, queuedEvent.params);
  }
}

export function trackPageView(path: string): void {
  if (canTrackGA()) {
    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  // Umami는 스크립트 로드 시 자동으로 pageview를 전송하므로 별도 호출 불필요
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params: GtagParams = {}
): void {
  if (canTrackGA()) {
    window.gtag?.('event', eventName, params);
  }

  if (typeof window === 'undefined') {
    return;
  }

  if (canTrackUmami()) {
    flushQueuedUmamiEvents();
    window.umami?.track(eventName, params as UmamiParams);
    return;
  }

  enqueueUmamiEvent(eventName, params as UmamiParams);
}
