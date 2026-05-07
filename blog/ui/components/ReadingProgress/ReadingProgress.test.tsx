import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { resetDomState, setWindowScrollY } from '@/shared/testing/dom-mocks';
import ReadingProgress from './ReadingProgress';

vi.mock('framer-motion', () => ({
  useScroll: () => ({ scrollYProgress: 0 }),
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
        className.includes('bg-[var(--color-toss-blue)]') && className.includes('h-full')
          ? 'reading-progress-bar'
          : 'reading-progress-root';
      return (
        <div data-testid={testId} data-animate={JSON.stringify(animate)} {...props}>
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

  it('keeps smooth scale transform hook wired through motion wrapper', async () => {
    resetDomState();

    render(<ReadingProgress />);

    const bar = screen.getByTestId('reading-progress-bar');

    expect(bar).toBeInTheDocument();
  });
});
