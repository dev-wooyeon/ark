import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GiscusComments } from './GiscusComments';

const mockGiscus = vi.fn((_props: Record<string, unknown>) => (
  <div data-testid="giscus-embed" />
));

vi.mock('@giscus/react', () => ({
  default: (props: unknown) => mockGiscus(props),
}));

describe('GiscusComments', () => {
  beforeEach(() => {
    mockGiscus.mockClear();
  });

  it('renders the comment embed with the fixed paper theme', () => {
    render(<GiscusComments slug="redis" />);

    expect(
      screen.getByRole('heading', { level: 2, name: '댓글' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('giscus-embed')).toBeInTheDocument();
    expect(mockGiscus).toHaveBeenCalledWith(
      expect.objectContaining({
        mapping: 'specific',
        term: 'redis',
        theme: 'light',
      })
    );
  });
});
