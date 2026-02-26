import { act, fireEvent, render, screen } from '@testing-library/react';
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
      whileHover,
      whileTap,
      ...props
    }: {
      children: React.ReactNode;
      whileHover?: unknown;
      whileTap?: unknown;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
    div: ({
      children,
      initial,
      animate,
      exit,
      transition,
      ...props
    }: {
      children: React.ReactNode;
      initial?: unknown;
      animate?: unknown;
      exit?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/lib/analytics', () => ({
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
});
