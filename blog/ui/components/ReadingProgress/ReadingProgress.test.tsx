import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  resetDomState,
  setWindowScrollY,
  setupMatchMediaMock,
} from '@/tests/support/dom-mocks';
import ReadingProgress from './ReadingProgress';

const { mockProgressSet } = vi.hoisted(() => ({
  mockProgressSet: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  useMotionValue: () => ({ set: mockProgressSet }),
  useSpring: (value: unknown) => value,
  motion: {
    div: ({
      children,
      animate,
      ...props
    }: {
      children: React.ReactNode;
      animate?: Record<string, unknown>;
      [key: string]: unknown;
    }) => {
      const className = props.className as string;
      const testId =
        className.includes('bg-[var(--color-toss-blue)]') &&
        className.includes('h-full')
          ? 'reading-progress-bar'
          : 'reading-progress-root';
      return (
        <div
          data-testid={testId}
          data-animate={JSON.stringify(animate)}
          {...props}
        >
          {children}
        </div>
      );
    },
  },
}));

describe('ReadingProgress', () => {
  it('shows progress bar only after passing the visibility threshold', () => {
    resetDomState();
    setWindowScrollY(0);

    render(<ReadingProgress />);

    const root = screen.getByTestId('reading-progress-root');
    expect(root).toHaveAttribute('data-animate', '{"opacity":0}');

    act(() => {
      setWindowScrollY(250);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('reading-progress-root')).toHaveAttribute(
      'data-animate',
      '{"opacity":1}'
    );
  });

  it('reads desktop progress from the AppShell scroll container', () => {
    resetDomState();
    setupMatchMediaMock(true, '(min-width: 768px)');
    mockProgressSet.mockClear();

    const scrollContainer = document.createElement('div');
    scrollContainer.dataset.pageScrollContainer = '';
    Object.defineProperties(scrollContainer, {
      scrollTop: { configurable: true, writable: true, value: 0 },
      scrollHeight: { configurable: true, value: 1_200 },
      clientHeight: { configurable: true, value: 200 },
    });
    document.body.appendChild(scrollContainer);

    render(<ReadingProgress />);

    act(() => {
      scrollContainer.scrollTop = 250;
      scrollContainer.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('reading-progress-root')).toHaveAttribute(
      'data-animate',
      '{"opacity":1}'
    );
    expect(mockProgressSet).toHaveBeenLastCalledWith(0.25);

    document.body.removeChild(scrollContainer);
  });

  it('keeps smooth scale transform hook wired through motion wrapper', async () => {
    resetDomState();

    render(<ReadingProgress />);

    const bar = screen.getByTestId('reading-progress-bar');

    expect(bar).toBeInTheDocument();
  });
});
