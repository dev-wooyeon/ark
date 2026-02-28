import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DwellTimeTracker from './DwellTimeTracker';
import { trackEvent } from '@/shared/analytics/lib/analytics';

vi.mock('@/shared/analytics/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

describe('DwellTimeTracker', () => {
  let hiddenGetterSpy: ReturnType<typeof vi.spyOn>;
  const mockedTrackEvent = vi.mocked(trackEvent);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    mockedTrackEvent.mockClear();
    hiddenGetterSpy = vi
      .spyOn(document, 'hidden', 'get')
      .mockReturnValue(false);
  });

  afterEach(() => {
    hiddenGetterSpy.mockRestore();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('does not emit checkpoint events while tab is hidden', () => {
    const { unmount } = render(<DwellTimeTracker slug="hidden-tab-post" />);

    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    hiddenGetterSpy.mockReturnValue(true);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    act(() => {
      vi.advanceTimersByTime(90_000);
    });

    expect(mockedTrackEvent).not.toHaveBeenCalled();

    unmount();
  });

  it('emits checkpoint after 30 seconds of visible activity', () => {
    render(<DwellTimeTracker slug="visible-post" />);

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(mockedTrackEvent).toHaveBeenCalledWith('dwell_time', {
      slug: 'visible-post',
      seconds: 30,
    });
  });
});
