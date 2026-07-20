import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter/CategoryFilter';

describe('CategoryFilter', () => {
  const baseProps = {
    categories: ['All', 'Tech', 'Life'] as const,
    categoryCounts: {
      All: 5,
      Tech: 3,
      Life: 2,
    },
  };

  it('renders all categories', () => {
    render(
      <CategoryFilter
        {...baseProps}
        activeCategory="All"
        onCategoryChange={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('All5');
    expect(buttons[1]).toHaveTextContent('Tech3');
    expect(buttons[2]).toHaveTextContent('Life2');
  });

  it('sets aria-pressed for active category', () => {
    render(
      <CategoryFilter
        {...baseProps}
        activeCategory="Tech"
        onCategoryChange={vi.fn()}
      />
    );

    const buttons = screen.getAllByRole('button');
    const techButton = buttons.find((button) => button.textContent === 'Tech3');
    const lifeButton = buttons.find((button) => button.textContent === 'Life2');

    expect(techButton).toBeDefined();
    expect(lifeButton).toBeDefined();

    if (!techButton || !lifeButton) {
      throw new Error('Expected category buttons not found');
    }

    expect(techButton).toHaveAttribute('aria-pressed', 'true');
    expect(lifeButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('invokes callback when a category is clicked', () => {
    const onCategoryChange = vi.fn();

    render(
      <CategoryFilter
        {...baseProps}
        activeCategory="All"
        onCategoryChange={onCategoryChange}
      />
    );

    const lifeButton = screen
      .getAllByRole('button')
      .find((button) => button.textContent === 'Life2');

    expect(lifeButton).toBeDefined();

    if (!lifeButton) {
      throw new Error('Life category button not found');
    }

    fireEvent.click(lifeButton);

    expect(onCategoryChange).toHaveBeenCalledWith('Life');
  });

  it('renders the active category as an underlined text control', () => {
    render(
      <CategoryFilter
        {...baseProps}
        activeCategory="Life"
        onCategoryChange={vi.fn()}
        variant="links"
      />
    );

    const lifeButton = screen
      .getAllByRole('button')
      .find((button) => button.textContent === 'Life(2)');

    expect(lifeButton).toBeDefined();

    if (!lifeButton) {
      throw new Error('Life category button not found');
    }

    expect(lifeButton).toHaveClass('border-b-2');
    expect(lifeButton).toHaveClass('border-[var(--color-toss-blue)]');
    expect(lifeButton).toHaveClass('text-[var(--color-toss-blue)]');
    expect(lifeButton).not.toHaveClass('rounded-[var(--radius-selection)]');
    expect(lifeButton).not.toHaveClass('bg-[var(--color-toss-blue)]');
  });
});
