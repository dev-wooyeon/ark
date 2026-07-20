import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResumePage from './ResumePage';

describe('ResumePage', () => {
  it('renders a four-column summary with core role and contact information', () => {
    const { container } = render(<ResumePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: '박은우' })
    ).toBeInTheDocument();
    expect(screen.getByText('백엔드 엔지니어', { exact: true })).toBeVisible();
    expect(screen.getAllByText('데이터 플랫폼')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'une@kakao.com' })).toHaveAttribute(
      'href',
      'mailto:une@kakao.com'
    );
    expect(screen.getByText('IoT Team', { exact: true })).toBeVisible();
    expect(screen.getByText('PG Platform Team', { exact: true })).toBeVisible();
    expect(screen.queryByRole('link', { name: '@9.81park' })).toBeNull();
    expect(screen.getByRole('heading', { name: '모노리스' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '엑심베이' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '개인 프로젝트' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '데이터 분석 자동화' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '실시간 CTR 집계 파이프라인' })
    ).toBeVisible();
    expect(
      screen.getByText(
        '운영 분석을 셀프서비스로 전환',
        { exact: true }
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        '운영 DB를 직접 조회하던 흐름을 CDC 기반 분석 파이프라인으로 바꿔, 1-2시간 걸리던 분석 요청을 즉시 조회할 수 있게 했습니다.'
      )
    ).toBeVisible();
    expect(
      screen.getByText('MySQL · Kafka · Flink · ClickHouse')
    ).toBeVisible();
    expect(screen.queryByText('MySQL · Kafka · Athena')).toBeNull();
    expect(screen.getAllByRole('link', { name: '회고' })).toHaveLength(5);
    expect(screen.getByRole('link', { name: '구축기' })).toHaveAttribute(
      'href',
      '/blog/ctr-pipeline'
    );
    expect(screen.getByRole('link', { name: '성능개선기' })).toHaveAttribute(
      'href',
      '/blog/macbook-air-m1-life'
    );
    expect(container.querySelector('main')).toHaveClass('pt-3');
    expect(container.querySelector('main')).not.toHaveClass(
      'bg-bg-primary'
    );
  });

  it('omits long-form history while retaining readable project context', () => {
    render(<ResumePage />);

    expect(screen.queryByRole('heading', { name: 'Selected Work' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Education' })).toBeNull();
    expect(screen.queryByText('해동검도 4단과 세계대회 본선을 준비하며')).toBeNull();
  });
});
