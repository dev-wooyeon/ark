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

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;
type UmamiParams = Record<string, unknown>;

interface QueuedUmamiEvent {
  eventName: AnalyticsEventName;
  params: UmamiParams;
}

declare global {
  interface Window {
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

export function trackEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsParams = {}
): void {
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
