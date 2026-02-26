import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RouteLoading from './RouteState/RouteLoading';

describe('RouteLoading', () => {
  it('shows default title and description', () => {
    render(<RouteLoading />);

    expect(screen.getByText('페이지를 불러오는 중입니다')).toBeInTheDocument();
    expect(screen.getByText('잠시만 기다려 주세요.')).toBeInTheDocument();
  });

  it('supports custom copy', () => {
    render(
      <RouteLoading
        title="로딩 중"
        description="잠깐만 기다려 주세요"
      />
    );

    expect(screen.getByText('로딩 중')).toBeInTheDocument();
    expect(screen.getByText('잠깐만 기다려 주세요')).toBeInTheDocument();
  });
});

