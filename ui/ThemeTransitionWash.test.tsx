import { act, render, screen } from '@testing-library/react';
import { createElement, type CSSProperties, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from 'next-themes';
import { useEffectiveMotionMode } from '@/ui/motion/model/motion-mode';
import { THEME_TRANSITION_ORIGIN_EVENT } from '@/ui/ThemeToggle';
import ThemeTransitionWash from './ThemeTransitionWash';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/ui/motion/model/motion-mode', () => ({
  useEffectiveMotionMode: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      animate,
      children,
      initial,
      onAnimationComplete: _onAnimationComplete,
      style,
      transition,
      ...props
    }: {
      animate?: unknown;
      children?: ReactNode;
      initial?: unknown;
      onAnimationComplete?: () => void;
      style?: CSSProperties;
      transition?: unknown;
      [key: string]: unknown;
    }) =>
      createElement(
        'div',
        {
          ...props,
          style,
          'data-testid': 'theme-transition-wash',
          'data-animate': JSON.stringify(animate),
          'data-background': style?.background,
          'data-initial': JSON.stringify(initial),
          'data-transition': JSON.stringify(transition),
        },
        children
      ),
  },
}));

function mockResolvedTheme(resolvedTheme: 'light' | 'dark') {
  vi.mocked(useTheme).mockReturnValue({
    resolvedTheme,
  } as ReturnType<typeof useTheme>);
}

describe('ThemeTransitionWash', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEffectiveMotionMode).mockReturnValue('full');
  });

  it('uses one opacity-only layer from the toggle origin', async () => {
    mockResolvedTheme('light');
    const { rerender } = render(<ThemeTransitionWash />);

    act(() => {
      window.dispatchEvent(
        new CustomEvent(THEME_TRANSITION_ORIGIN_EVENT, {
          detail: { x: 24, y: 32, nextTheme: 'dark' },
        })
      );
    });

    mockResolvedTheme('dark');
    rerender(<ThemeTransitionWash />);

    const wash = await screen.findByTestId('theme-transition-wash');

    expect(screen.getAllByTestId('theme-transition-wash')).toHaveLength(1);
    expect(wash).toHaveAttribute(
      'data-animate',
      JSON.stringify({ opacity: [0, 0.14, 0] })
    );
    expect(wash.getAttribute('data-animate')).not.toContain('clipPath');
    expect(wash).toHaveAttribute(
      'data-transition',
      JSON.stringify({ duration: 0.28, ease: [0.22, 1, 0.36, 1] })
    );
    expect(wash.getAttribute('data-background')).toContain('24px 32px');
    expect(wash.style.willChange).toBe('opacity');
  });

  it('keeps reduced motion shorter and more subtle', async () => {
    vi.mocked(useEffectiveMotionMode).mockReturnValue('reduced');
    mockResolvedTheme('light');
    const { rerender } = render(<ThemeTransitionWash />);

    mockResolvedTheme('dark');
    rerender(<ThemeTransitionWash />);

    const wash = await screen.findByTestId('theme-transition-wash');

    expect(wash).toHaveAttribute(
      'data-animate',
      JSON.stringify({ opacity: [0, 0.08, 0] })
    );
    expect(wash).toHaveAttribute(
      'data-transition',
      JSON.stringify({ duration: 0.12, ease: [0.22, 1, 0.36, 1] })
    );
  });

  it('skips the wash when motion is disabled', () => {
    vi.mocked(useEffectiveMotionMode).mockReturnValue('off');
    mockResolvedTheme('light');
    const { rerender } = render(<ThemeTransitionWash />);

    mockResolvedTheme('dark');
    rerender(<ThemeTransitionWash />);

    expect(
      screen.queryByTestId('theme-transition-wash')
    ).not.toBeInTheDocument();
  });
});
