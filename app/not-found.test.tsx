import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from './not-found';

describe('NotFound', () => {
  it('offers a Korean recovery path to the home page', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: '페이지를 찾을 수 없어요' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '홈으로 돌아가기' })
    ).toHaveAttribute('href', '/');
  });
});
