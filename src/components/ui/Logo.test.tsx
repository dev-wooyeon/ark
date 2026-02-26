import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...props} />,
}));

describe('Logo', () => {
  it('renders logo image with expected source', () => {
    render(<Logo />);

    const image = screen.getByRole('img', { name: 'Logo' });

    expect(image).toHaveAttribute('src', '/logo.png');
  });
});

