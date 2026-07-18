import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResumePage from './ResumePage';

describe('ResumePage', () => {
  it('renders the resume as a three-column editorial header with core contact links', () => {
    const { container } = render(<ResumePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: '박은우' })
    ).toBeInTheDocument();
    expect(screen.getByText('Backend / Data Platform Engineer')).toBeVisible();
    expect(screen.getByRole('link', { name: 'une@kakao.com' })).toHaveAttribute(
      'href',
      'mailto:une@kakao.com'
    );
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Selected Work' })
    ).toBeVisible();
    expect(container.querySelector('header')).toHaveClass('md:grid-cols-6');
  });
});
