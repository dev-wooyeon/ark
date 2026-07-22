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

  it('lets prose stylesheet control paragraph typography', () => {
    const { p: Paragraph } = getMDXComponents({});

    if (!Paragraph) {
      throw new Error('Expected paragraph component to be defined');
    }

    render(<Paragraph>본문 문단</Paragraph>);

    expect(screen.getByText('본문 문단')).not.toHaveClass('text-base');
    expect(screen.getByText('본문 문단')).not.toHaveClass('leading-relaxed');
  });

  it('uses semantic tokens for MDX headings', () => {
    const { h2: Heading } = getMDXComponents({});

    if (!Heading) {
      throw new Error('Expected heading component to be defined');
    }

    render(<Heading>제목</Heading>);

    expect(screen.getByRole('heading', { name: '제목' })).toHaveClass(
      'text-[var(--color-text-primary)]'
    );
  });
});
