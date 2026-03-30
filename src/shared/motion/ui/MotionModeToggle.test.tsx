import { act, fireEvent, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import MotionModeToggle from './MotionModeToggle';

const mockSetMotionMode = vi.fn();
const mockTrackEvent = vi.fn();

vi.mock('@/shared/motion/model/motion-mode', () => ({
  getNextMotionMode: (mode: 'auto' | 'reduced' | 'off') =>
    mode === 'auto' ? 'reduced' : mode === 'reduced' ? 'off' : 'auto',
  useMotionMode: () => ({
    motionMode: 'auto',
    effectiveMotionMode: 'full',
    setMotionMode: mockSetMotionMode,
  }),
}));

vi.mock('@/shared/analytics/lib/analytics', () => ({
  AnalyticsEvents: {
    motion: 'motion_mode_changed',
  },
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

vi.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      ...props
    }: {
      children: ReactNode;
      whileHover?: unknown;
      whileTap?: unknown;
      [key: string]: unknown;
    }) => {
      const {
        whileHover: _whileHover,
        whileTap: _whileTap,
        ...domProps
      } = props;
      return createElement('button', domProps, children);
    },
  },
}));

describe('MotionModeToggle', () => {
  it('cycles mode and tracks changes', async () => {
    render(<MotionModeToggle />);

    const button = screen.getByRole('button', {
      name: '모션 모드 자동 (다음: 축소)',
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockSetMotionMode).toHaveBeenCalledWith('reduced');
    expect(mockTrackEvent).toHaveBeenCalledWith('motion_mode_changed', {
      from_mode: 'auto',
      to_mode: 'reduced',
      effective_mode: 'full',
      surface: 'header',
    });
  });
});
