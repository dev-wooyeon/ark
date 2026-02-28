import { vi } from 'vitest';

export function setupMatchMediaMock(matches: boolean, mediaQuery = '(max-width: 767px)') {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const createMatchMediaResult = (query: string) => ({
    matches: query === mediaQuery ? matches : false,
    media: query,
    onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type === 'change' && listener) {
        listeners.add(listener as (event: MediaQueryListEvent) => void);
      }
    }),
    removeEventListener: vi.fn(
      (type: string, listener: EventListenerOrEventListenerObject | null) => {
        if (type === 'change' && listener) {
          listeners.delete(listener as (event: MediaQueryListEvent) => void);
        }
      }
    ),
    dispatchEvent: (event: Event) => {
      if (event.type !== 'change') {
        return true;
      }

      listeners.forEach((listener) => {
        listener(event as MediaQueryListEvent);
      });
      return true;
    },
  });

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation(createMatchMediaResult),
  });
}

export function setupResizeObserverMock() {
  class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }

  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
}

export function setupScrollToMock() {
  window.scrollTo = vi.fn();
}

export function setWindowScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  });
}

export function resetDomState() {
  setupMatchMediaMock(true);
  setupResizeObserverMock();
  setupScrollToMock();
  setWindowScrollY(0);
}

