import { act, render, screen } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import MobileBottomNav from './MobileBottomNav';

const mockTrackEvent = vi.fn();

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({
      children,
      ...props
    }: {
      children: ReactNode;
      initial?: unknown;
      animate?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }) => {
      const {
        initial: _initial,
        animate: _animate,
        transition: _transition,
        ...domProps
      } = props;
      return createElement('nav', domProps, children);
    },
  },
}));

vi.mock('@/shared/analytics/lib/analytics', () => {
  return {
    AnalyticsEvents: {
      click: 'click',
      theme: 'theme',
      view: 'view',
    },
    trackEvent: (...args: unknown[]) => mockTrackEvent(...args),
  };
});

describe('MobileBottomNav', () => {
  it('renders four mobile nav links', () => {
    render(<MobileBottomNav pathname="/" visible />);

    expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Engineering' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Life' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resume' })).toBeInTheDocument();
  });

  it('marks active item based on exact home path', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const home = await screen.findByRole('link', { name: '홈' });
    expect(home).toHaveAttribute('aria-current', 'page');

    const engineering = await screen.findByRole('link', {
      name: 'Engineering',
    });
    expect(engineering).not.toHaveAttribute('aria-current');
  });

  it('marks active item for nested engineering path', async () => {
    render(<MobileBottomNav pathname="/engineering/how-to-test" visible />);

    const engineering = await screen.findByRole('link', {
      name: 'Engineering',
    });
    expect(engineering).toHaveAttribute('aria-current', 'page');
  });

  it('applies inactive hover style token for non-active items', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const life = await screen.findByRole('link', { name: 'Life' });
    const lifeContent = life.querySelector('div');

    expect(lifeContent).toHaveClass('border-transparent');
    expect(lifeContent).toHaveClass('hover:bg-[var(--mobile-nav-hover-bg)]');
    expect(lifeContent).toHaveClass(
      'group-active:bg-[var(--mobile-nav-hover-bg)]'
    );
    expect(lifeContent).toHaveClass('min-h-14');
  });

  it('applies focus and touch token classes on each nav control', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const home = await screen.findByRole('link', { name: '홈' });
    expect(home).toHaveClass(
      'focus-visible:ring-[var(--mobile-nav-focus-ring)]'
    );
    expect(home).toHaveClass(
      'focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]'
    );
    expect(home).toHaveClass('touch-manipulation');
    expect(home).toHaveClass('active:scale-[0.97]');
  });

  it('tracks analytics on tab click', async () => {
    mockTrackEvent.mockClear();

    await act(async () => {
      render(<MobileBottomNav pathname="/engineering" visible />);
      await Promise.resolve();
    });

    const resume = screen.getByRole('link', { name: 'Resume' });
    await act(async () => {
      await Promise.resolve();
      resume.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('click', {
      target: 'mobile_bottom_nav',
      destination: '/resume',
    });
  });

  it('applies motion offset class when hidden', () => {
    render(<MobileBottomNav pathname="/" visible={false} />);

    const nav = screen.getByLabelText('모바일 하단 네비게이션');
    expect(nav).toHaveClass('fixed');
    expect((nav as HTMLDivElement).getAttribute('aria-label')).toBe(
      '모바일 하단 네비게이션'
    );
  });
});
