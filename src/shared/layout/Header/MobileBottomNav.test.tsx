import { act, render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MobileBottomNav from './MobileBottomNav';

const mockToggle = vi.fn();
const mockTrackEvent = vi.fn();

vi.mock('kbar', () => ({
  useKBar: () => ({
    query: {
      toggle: mockToggle,
    },
  }),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
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
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <nav {...props}>{children}</nav>,
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
  it('renders five mobile nav items', () => {
    render(<MobileBottomNav pathname="/" visible />);

    expect(screen.getByRole('link', { name: '시리즈' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '블로그' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '이력서' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '검색' })).toBeInTheDocument();
  });

  it('marks active item based on exact home path', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const home = await screen.findByRole('link', { name: '홈' });
    expect(home).toHaveAttribute('aria-current', 'page');

    const blog = await screen.findByRole('link', { name: '블로그' });
    expect(blog).not.toHaveAttribute('aria-current');
  });

  it('marks active item for nested blog path', async () => {
    render(<MobileBottomNav pathname="/blog/how-to-test" visible />);

    const blog = await screen.findByRole('link', { name: '블로그' });
    expect(blog).toHaveAttribute('aria-current', 'page');
  });

  it('applies inactive hover style token for non-active items', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const searchButton = await screen.findByRole('button', { name: '검색' });
    const blog = await screen.findByRole('link', { name: '블로그' });
    const blogContent = blog.querySelector('div');

    expect(blogContent).toHaveClass('border-transparent');
    expect(blogContent).toHaveClass('hover:bg-[var(--mobile-nav-hover-bg)]');
    expect(searchButton).toHaveAttribute('type', 'button');
  });

  it('applies focus token classes on each nav control', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    const home = await screen.findByRole('link', { name: '홈' });
    expect(home).toHaveClass('focus-visible:ring-[var(--mobile-nav-focus-ring)]');
    expect(home).toHaveClass('focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]');
  });

  it('calls kbar toggle when search action is clicked', async () => {
    render(<MobileBottomNav pathname="/" visible />);

    fireEvent.click(screen.getByRole('button', { name: '검색' }));

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('tracks analytics on link click', async () => {
    await act(async () => {
      render(<MobileBottomNav pathname="/blog" visible />);
      await Promise.resolve();
    });

    const resume = screen.getByRole('link', { name: '이력서' });
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
    expect((nav as HTMLDivElement).getAttribute('aria-label')).toBe('모바일 하단 네비게이션');
  });
});
