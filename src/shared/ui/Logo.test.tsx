import { createElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill: _fill,
    priority: _priority,
    ...props
  }: {
    src: string;
    alt: string;
    fill?: boolean;
    priority?: boolean;
    [key: string]: unknown;
  }) => createElement('img', { src, alt, ...props }),
}));

describe('Logo', () => {
  it('renders logo image with expected source', () => {
    render(<Logo />);

    const image = screen.getByRole('img', { name: 'Logo' });

    expect(image).toHaveAttribute('src', '/logo.png');
  });
});
