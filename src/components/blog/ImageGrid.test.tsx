import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageGrid } from './ImageGrid';

describe('ImageGrid', () => {
  it('renders children and applies spacing styles', () => {
    render(
      <ImageGrid gap={24} cols={3}>
        <p>first</p>
      </ImageGrid>
    );

    const wrapper = screen.getByText('first').parentElement;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('grid');
    expect(wrapper).toHaveClass('grid-cols-2');
    expect(wrapper).toHaveClass('sm:grid-cols-3');
    expect(wrapper).toHaveStyle({ gap: '24px' });
  });
});

