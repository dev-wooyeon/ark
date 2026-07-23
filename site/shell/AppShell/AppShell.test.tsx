import { render, screen, within } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import AppShell from './AppShell';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

describe('AppShell', () => {
  it('keeps Archive and Resume visible with external links in the identity rail', () => {
    const { container } = render(
      <AppShell>
        <main>content</main>
      </AppShell>
    );

    const primaryNavigation = within(screen.getByLabelText('Ark 주요 탐색'));

    expect(
      primaryNavigation.getByRole('link', { name: 'Archive' })
    ).toHaveAttribute('href', '/archive');
    expect(
      primaryNavigation.getByRole('link', { name: 'Resume' })
    ).toHaveAttribute('href', '/resume');
    expect(
      primaryNavigation.queryByRole('link', { name: 'Tech' })
    ).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Ark 외부 링크')).toHaveLength(1);
    expect(container.querySelector('.ark-site-identity')).toContainElement(
      screen.getByLabelText('Ark 외부 링크')
    );
    expect(container.querySelector('footer')).toBeNull();
    expect(
      container.querySelector('[data-page-layout="home"]')
    ).toBeInTheDocument();
  });

  it('treats existing post routes as part of Archive', () => {
    vi.mocked(usePathname).mockReturnValue('/blog/ctr-pipeline');
    render(
      <AppShell>
        <main>content</main>
      </AppShell>
    );

    expect(screen.getByRole('link', { name: 'Archive' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
