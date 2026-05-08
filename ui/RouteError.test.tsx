import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteError from './RouteState/RouteError';

describe('RouteError', () => {
  it('renders default error copy', () => {
    render(<RouteError />);

    expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument();
  });

  it('calls retry callback when action is clicked', async () => {
    const onRetry = vi.fn();
    const { getByRole } = render(
      <RouteError
        title="네트워크 오류"
        description="잠시 후 재시도"
        onRetry={onRetry}
      />
    );

    await getByRole('button', { name: '다시 시도' }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

