import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Container from './Container';

describe('Container', () => {
  it('uses default size class and applies custom className', () => {
    render(
      <Container className="custom-class" as="section">
        <p>content</p>
      </Container>
    );

    const section = screen.getByText('content').closest('section');

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('mx-auto');
    expect(section).toHaveClass('max-w-[1000px]');
    expect(section).toHaveClass('custom-class');
  });

  it('supports different size options', () => {
    render(
      <Container size="sm">
        <p>small</p>
      </Container>
    );

    const container = screen.getByText('small').parentElement;

    expect(container).toHaveClass('max-w-[640px]');
  });
});

