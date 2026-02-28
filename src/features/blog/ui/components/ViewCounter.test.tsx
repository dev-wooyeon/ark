import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ViewCounter from './ViewCounter';

const mockTrackView = vi.fn();
const mockGetViewCount = vi.fn();

vi.mock('@/app/actions/view', () => ({
  getViewCount: (...args: unknown[]) => mockGetViewCount(...args),
  trackView: (...args: unknown[]) => mockTrackView(...args),
}));

describe('ViewCounter', () => {
  const slug = 'redis-deep-dive-02-core-data-types';

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('uses cached view count when already tracked in this session', async () => {
    sessionStorage.setItem(`viewed:${slug}`, '1');
    mockGetViewCount.mockResolvedValue(42);

    render(<ViewCounter slug={slug} />);

    await screen.findByText('42 조회수');

    expect(mockGetViewCount).toHaveBeenCalledWith(slug);
    expect(mockTrackView).not.toHaveBeenCalled();
  });

  it('tracks and stores view count when not yet tracked', async () => {
    sessionStorage.removeItem(`viewed:${slug}`);
    mockTrackView.mockResolvedValue(11);

    render(<ViewCounter slug={slug} />);

    await screen.findByText('11 조회수');

    expect(mockTrackView).toHaveBeenCalledWith(slug);
    expect(sessionStorage.getItem(`viewed:${slug}`)).toBe('1');
  });

  it('shows fallback when API returns null', async () => {
    sessionStorage.removeItem(`viewed:${slug}`);
    mockTrackView.mockResolvedValue(null);

    render(<ViewCounter slug={slug} />);

    expect(await screen.findByText('조회수 집계 중')).toBeInTheDocument();
  });
});
