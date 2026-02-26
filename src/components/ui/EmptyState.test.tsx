import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '.';

describe('EmptyState', () => {
  it('renders title and description with polite status', () => {
    render(
      <EmptyState
        title="데이터 없음"
        description="표시할 데이터가 없습니다."
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('데이터 없음');
    expect(screen.getByText('표시할 데이터가 없습니다.')).toBeInTheDocument();
  });

  it('renders search variant tone markers', () => {
    render(
      <EmptyState
        variant="search"
        title="검색 결과 없음"
        description="다른 키워드로 시도해 보세요."
      />
    );

    const title = screen.getByText('검색 결과 없음');
    expect(title).toHaveClass('text-[var(--color-grey-900)]');
  });

  it('renders error variant title style', () => {
    render(
      <EmptyState
        variant="error"
        title="오류 발생"
        description="잠시 후 다시 시도해 주세요."
      />
    );

    expect(screen.getByText('오류 발생')).toHaveClass('text-[var(--color-grey-900)]');
  });

  it('renders action link when href is provided', () => {
    render(
      <EmptyState
        title="빈 상태"
        description="버튼이 보입니다"
        action={{
          label: '메인으로',
          href: '/',
        }}
      />
    );

    const action = screen.getByRole('link', { name: '메인으로' });
    expect(action).toHaveAttribute('href', '/');
  });

  it('fires action callback when clicked', async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="빈 상태"
        description="재시도"
        action={{
          label: '다시시도',
          onClick,
        }}
      />
    );

    await screen.getByRole('button', { name: '다시시도' }).click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

