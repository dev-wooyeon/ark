import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getMDXComponents } from './components';

describe('getMDXComponents', () => {
  it('assigns normalized heading ids from rendered text', () => {
    const { h3: H3, h4: H4 } = getMDXComponents({});

    if (!H3 || !H4) {
      throw new Error('Expected heading components to be defined');
    }

    render(
      <>
        <H3>
          <strong>
            🚀 성능 증명 <code>k6</code>
          </strong>
        </H3>
        <H3>🚀 성능 증명 k6</H3>
        <H4>하위 섹션</H4>
      </>
    );

    const headings = screen.getAllByRole('heading', {
      name: '🚀 성능 증명 k6',
    });

    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveAttribute('id', '성능-증명-k6');
    expect(headings[1]).toHaveAttribute('id', '성능-증명-k6-1');
    expect(screen.getByRole('heading', { name: '하위 섹션' })).toHaveAttribute(
      'id',
      '하위-섹션'
    );
  });
});
