import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { pathnameState, setMockPathname } from '@/shared/testing/route-mocks';
import Header from './Header';
import { useScrollVisibility } from './useScrollVisibility';

const mockToggle = vi.fn();

const mockUseScrollVisibility = vi.mocked(useScrollVisibility);

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

vi.mock('kbar', () => ({
  useKBar: () => ({
    query: {
      toggle: mockToggle,
    },
  }),
}));

vi.mock('./useScrollVisibility', () => ({
  useScrollVisibility: vi.fn(),
}));

vi.mock('./MobileBottomNav', () => ({
  default: ({ pathname, visible }: { pathname: string; visible: boolean }) => (
    <div
      data-testid="mobile-bottom-nav"
      data-pathname={pathname}
      data-visible={String(visible)}
    />
  ),
}));

vi.mock('@/shared/ui/ThemeToggle', () => ({
  default: () => <button aria-label="theme">theme</button>,
}));

vi.mock('@/shared/ui/Logo', () => ({
  default: () => <div>Logo</div>,
}));

vi.mock('framer-motion', () => ({
  motion: {
    header: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <header {...props}>{children}</header>,
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));

describe('Header', () => {
  it('passes pathname and visibility state to MobileBottomNav', () => {
    setMockPathname('/engineering');
    pathnameState.value = '/engineering';
    mockUseScrollVisibility.mockReturnValue({
      topHeaderVisible: true,
      bottomBarVisible: false,
    });

    const { getByTestId } = render(<Header />);

    const nav = getByTestId('mobile-bottom-nav');
    expect(nav.dataset.pathname).toBe('/engineering');
    expect(nav.dataset.visible).toBe('false');
  });

  it('toggles pointer-events class when top header hides', () => {
    setMockPathname('/engineering');
    pathnameState.value = '/engineering';
    mockUseScrollVisibility.mockReturnValue({
      topHeaderVisible: false,
      bottomBarVisible: true,
    });

    const { container } = render(<Header />);
    const mobileHeader = container.querySelector('header.md\\:hidden');

    expect(mobileHeader).toHaveClass('pointer-events-none');
  });

  it('renders desktop search button and calls kbar toggle on click', async () => {
    setMockPathname('/engineering');
    pathnameState.value = '/engineering';
    mockUseScrollVisibility.mockReturnValue({
      topHeaderVisible: true,
      bottomBarVisible: true,
    });

    render(<Header />);

    act(() => {
      screen.getByRole('button', { name: /검색/ }).click();
    });

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
