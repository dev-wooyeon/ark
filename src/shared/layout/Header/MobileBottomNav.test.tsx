import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
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
  it('renders drawer links when open', () => {
    render(<MobileBottomNav pathname="/" visible open />);

    expect(screen.getByRole('link', { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Tech/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Life/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Resume/ })).toBeInTheDocument();
  });

  it('marks active item based on exact home path', async () => {
    render(<MobileBottomNav pathname="/" visible open />);

    const home = await screen.findByRole('link', { name: /Home/ });
    expect(home).toHaveAttribute('aria-current', 'page');

    const tech = await screen.findByRole('link', { name: /Tech/ });
    expect(tech).not.toHaveAttribute('aria-current');
  });

  it('marks active item for nested engineering path', async () => {
    render(
      <MobileBottomNav pathname="/engineering/how-to-test" visible open />
    );

    const tech = await screen.findByRole('link', { name: /Tech/ });
    expect(tech).toHaveAttribute('aria-current', 'page');
  });

  it('renders drawer shell when open', () => {
    render(<MobileBottomNav pathname="/" visible open />);

    expect(screen.getByLabelText('모바일 네비게이션')).toBeInTheDocument();
    expect(screen.getByText('블로그 섹션과 외부 링크')).toBeInTheDocument();
  });

  it('calls close handler when backdrop is clicked', () => {
    const handleOpenChange = vi.fn();

    render(
      <MobileBottomNav
        pathname="/"
        visible
        open
        onOpenChange={handleOpenChange}
      />
    );

    screen.getAllByRole('button', { name: '메뉴 닫기' })[0].click();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('tracks analytics on tab click', async () => {
    mockTrackEvent.mockClear();

    await act(async () => {
      render(<MobileBottomNav pathname="/engineering" visible open />);
      await Promise.resolve();
    });

    const resume = screen.getByRole('link', { name: /Resume/ });
    await act(async () => {
      await Promise.resolve();
      resume.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(mockTrackEvent).toHaveBeenCalledWith('click', {
      target: 'mobile_nav_drawer',
      destination: '/resume',
    });
  });

  it('hides pointer events when closed', () => {
    render(<MobileBottomNav pathname="/" visible open={false} />);

    const drawerRoot =
      screen.getAllByRole('button', { name: '메뉴 닫기', hidden: true })[0]
        .parentElement;
    expect(drawerRoot).toHaveClass('pointer-events-none');
  });
});
