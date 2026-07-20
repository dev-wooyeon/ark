import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('presents the personal statement without an archive feed', () => {
    render(<HomePage />);

    expect(
      screen.getByText((_content, element) => {
        return (
          element?.tagName === 'P' &&
          element.textContent?.includes(
            'Building backend systems with less complexity and more trust.'
          ) === true &&
          element.textContent?.includes(
            'Currently building @9.81park.'
          ) === true
        );
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '@9.81park' })).toHaveAttribute(
      'href',
      'https://www.981park.com'
    );
    expect(screen.getByRole('link', { name: '@9.81park' })).toHaveAttribute(
      'target',
      '_blank'
    );
    expect(screen.getByRole('link', { name: '@9.81park' })).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
    expect(screen.queryByRole('button', { name: /All/ })).not.toBeInTheDocument();
  });
});
