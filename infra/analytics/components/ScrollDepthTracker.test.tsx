import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  resetDomState,
  setWindowScrollY,
  setupMatchMediaMock,
} from '@/tests/support/dom-mocks';
import { trackEvent } from '@/infra/analytics/lib/analytics';
import ScrollDepthTracker from './ScrollDepthTracker';

vi.mock('@/infra/analytics/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('ScrollDepthTracker', () => {
  const mockedTrackEvent = vi.mocked(trackEvent);

  beforeEach(() => {
    resetDomState();
    mockedTrackEvent.mockClear();
  });

  it('tracks desktop milestones from the AppShell scroll container', () => {
    setupMatchMediaMock(true, '(min-width: 768px)');

    const scrollContainer = document.createElement('div');
    scrollContainer.dataset.pageScrollContainer = '';
    Object.defineProperties(scrollContainer, {
      scrollTop: { configurable: true, writable: true, value: 0 },
      scrollHeight: { configurable: true, value: 1_200 },
      clientHeight: { configurable: true, value: 200 },
    });
    document.body.appendChild(scrollContainer);

    render(<ScrollDepthTracker slug="desktop-post" />);

    act(() => {
      scrollContainer.scrollTop = 500;
      scrollContainer.dispatchEvent(new Event('scroll'));
    });

    expect(mockedTrackEvent.mock.calls).toEqual([
      ['scroll_depth', { slug: 'desktop-post', depth: 25 }],
      ['scroll_depth', { slug: 'desktop-post', depth: 50 }],
    ]);

    document.body.removeChild(scrollContainer);
  });

  it('tracks mobile milestones from the window scroll position', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 1_200,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 200,
    });

    render(<ScrollDepthTracker slug="mobile-post" />);

    act(() => {
      setWindowScrollY(760);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(mockedTrackEvent.mock.calls).toEqual([
      ['scroll_depth', { slug: 'mobile-post', depth: 25 }],
      ['scroll_depth', { slug: 'mobile-post', depth: 50 }],
      ['scroll_depth', { slug: 'mobile-post', depth: 75 }],
    ]);
  });
});
