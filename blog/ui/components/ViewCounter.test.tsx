import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ViewCounter from './ViewCounter';

const mockTrackView = vi.fn();
const mockGetViewCount = vi.fn();

vi.mock('@/blog/api/view', () => ({
  getViewCount: (...args: unknown[]) => mockGetViewCount(...args),
  trackView: (...args: unknown[]) => mockTrackView(...args),
}));

const sessionStorageDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'sessionStorage'
);

describe('ViewCounter', () => {
  const slug = 'redis-deep-dive-02-core-data-types';

  afterEach(() => {
    if (sessionStorageDescriptor) {
      Object.defineProperty(window, 'sessionStorage', sessionStorageDescriptor);
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('uses cached view count when already tracked in this session', async () => {
    sessionStorage.setItem(`viewed:${slug}`, '1');
    mockGetViewCount.mockResolvedValue(42);

    render(<ViewCounter slug={slug} />);

    await screen.findByText('조회수 42회');

    expect(mockGetViewCount).toHaveBeenCalledWith(slug);
    expect(mockTrackView).not.toHaveBeenCalled();
  });

  it('tracks and stores view count when not yet tracked', async () => {
    sessionStorage.removeItem(`viewed:${slug}`);
    mockTrackView.mockResolvedValue(11);

    render(<ViewCounter slug={slug} />);

    await screen.findByText('조회수 11회');

    expect(mockTrackView).toHaveBeenCalledWith(slug);
    expect(sessionStorage.getItem(`viewed:${slug}`)).toBe('1');
  });

  it('shows fallback when API returns null', async () => {
    sessionStorage.removeItem(`viewed:${slug}`);
    mockTrackView.mockResolvedValue(null);

    render(<ViewCounter slug={slug} />);

    expect(
      await screen.findByText('조회수를 준비하고 있어요')
    ).toBeInTheDocument();
  });

  it('tracks view when sessionStorage is unavailable', async () => {
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() {
        throw new Error('Storage access blocked');
      },
    });
    mockTrackView.mockResolvedValue(7);

    render(<ViewCounter slug={slug} />);

    await screen.findByText('조회수 7회');

    expect(mockTrackView).toHaveBeenCalledWith(slug);
    expect(mockGetViewCount).not.toHaveBeenCalled();
  });
});
