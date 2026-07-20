import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RouteError from './RouteState/RouteError';

describe('RouteError', () => {
  it('renders a route-aligned textual status without an illustration', () => {
    render(<RouteError />);

    expect(screen.getByRole('status')).toHaveTextContent('UNAVAILABLE');
    expect(
      screen.getByRole('heading', { name: '이 페이지를 표시할 수 없습니다' })
    ).toHaveClass('ark-route-error-title');
    expect(screen.getByText('잠시 후 다시 시도해 주세요.')).toBeInTheDocument();
    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });

  it('calls retry callback from the text action', async () => {
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
    expect(getByRole('button', { name: '다시 시도' })).toHaveClass(
      'ark-route-error-retry'
    );
  });
});
