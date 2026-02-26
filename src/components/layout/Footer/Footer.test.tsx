import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders legal text and social links', () => {
    render(<Footer />);

    expect(screen.getByText(/eunu\.log/i)).toBeInTheDocument();

    const github = screen.getByRole('link', { name: 'GitHub' });
    const email = screen.getByRole('link', { name: 'Email' });

    expect(github).toHaveAttribute('href', 'https://github.com/dev-wooyeon');
    expect(email).toHaveAttribute('href', 'mailto:une@kakao.com');
  });
});

