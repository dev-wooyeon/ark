import { act, fireEvent, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useTheme } from 'next-themes';
import ThemeToggle from './ThemeToggle';

const mockSetTheme = vi.fn();
const mockTrackEvent = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
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
    span: ({
      children,
      ...props
    }: {
      children: ReactNode;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }) => {
      const {
        initial: _initial,
        animate,
        exit: _exit,
        transition,
        ...domProps
      } = props;
      return createElement(
        'span',
        {
          ...domProps,
          'data-animate': JSON.stringify(animate),
          'data-transition': JSON.stringify(transition),
        },
        children
      );
    },
  },
  AnimatePresence: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('@/ui/motion/model/motion-mode', () => ({
  useEffectiveMotionMode: () => 'full',
}));

vi.mock('@/infra/analytics/lib/analytics', () => ({
  AnalyticsEvents: {
    click: 'click',
    theme: 'theme',
    view: 'view',
  },
  trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows mount state and toggles to light mode from dark', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    } as ReturnType<typeof useTheme>);

    render(<ThemeToggle />);

    const button = await screen.findByRole('button', {
      name: '라이트 모드로 전환',
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockTrackEvent).toHaveBeenCalledWith('theme', {
      from_theme: 'dark',
      to_theme: 'light',
    });
  });

  it('toggles to dark mode from light', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    } as ReturnType<typeof useTheme>);

    render(<ThemeToggle />);

    const button = await screen.findByRole('button', {
      name: '다크 모드로 전환',
    });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockTrackEvent).toHaveBeenCalledWith('theme', {
      from_theme: 'light',
      to_theme: 'dark',
    });
  });

  it('stretches the selector toward the next theme before it settles', async () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    } as ReturnType<typeof useTheme>);

    const { rerender } = render(<ThemeToggle />);

    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    } as ReturnType<typeof useTheme>);
    rerender(<ThemeToggle />);

    const selector = await screen.findByTestId('theme-selector');

    expect(selector).toHaveAttribute(
      'data-animate',
      JSON.stringify({
        x: [0, 8, 40, 40],
        y: '-50%',
        scaleX: [1, 1.42, 0.94, 1],
        scaleY: [1, 0.94, 1.03, 1],
        rotate: [0, -5, 1, 0],
      })
    );
    expect(selector.style.transformOrigin).toBe('left center');
    expect(selector.style.willChange).toBe('transform');
  });
});
