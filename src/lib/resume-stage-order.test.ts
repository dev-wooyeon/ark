import { describe, expect, it } from 'vitest';
import { orderExperienceStages } from './resume-stage-order';
import type { ExperienceStage } from '@/data/resume';

describe('orderExperienceStages', () => {
  it('orders core stages by fixed priority regardless of input order', () => {
    const unorderedStages: ExperienceStage[] = [
      { key: 'result', label: '결과', detail: '결과 내용' },
      { key: 'implementation', label: '구현', detail: '구현 내용' },
      { key: 'problem', label: '문제 정의', detail: '문제 내용' },
      { key: 'verification', label: '검증', detail: '검증 내용' },
      { key: 'decision', label: '의사결정', detail: '결정 내용' },
    ];

    const ordered = orderExperienceStages(unorderedStages);

    expect(ordered.map((stage) => stage.key)).toEqual([
      'problem',
      'decision',
      'implementation',
      'verification',
      'result',
    ]);
  });

  it('keeps extension stages after core stages while preserving extension order', () => {
    const unorderedStages: ExperienceStage[] = [
      { key: 'extension', label: '전환 전략', detail: '전환 내용' },
      { key: 'result', label: '결과', detail: '결과 내용' },
      { key: 'problem', label: '문제 정의', detail: '문제 내용' },
      { key: 'extension', label: '모니터링', detail: '모니터링 내용' },
    ];

    const ordered = orderExperienceStages(unorderedStages);

    expect(ordered.map((stage) => stage.key)).toEqual([
      'problem',
      'result',
      'extension',
      'extension',
    ]);
    expect(
      ordered
        .filter((stage) => stage.key === 'extension')
        .map((stage) => stage.label)
    ).toEqual(['전환 전략', '모니터링']);
  });

  it('returns an empty array for empty input', () => {
    expect(orderExperienceStages([])).toEqual([]);
  });
});
