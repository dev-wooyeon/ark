import { describe, expect, it } from 'vitest';
import { parseHeadingsFromMdx } from './markdown';

describe('parseHeadingsFromMdx', () => {
  it('parses headings and keeps duplicate ids unique', () => {
    const mdx = `
## Redis 개요
### 성능 포인트
## Redis 개요
`;

    const headings = parseHeadingsFromMdx(mdx);

    expect(headings).toHaveLength(3);
    expect(headings[0]).toEqual({
      id: 'redis-개요',
      text: 'Redis 개요',
      level: 2,
    });
    expect(headings[1]).toEqual({
      id: '성능-포인트',
      text: '성능 포인트',
      level: 3,
    });
    expect(headings[2]).toEqual({
      id: 'redis-개요-1',
      text: 'Redis 개요',
      level: 2,
    });
  });

  it('returns an empty array for invalid content', () => {
    expect(parseHeadingsFromMdx('')).toEqual([]);
  });
});
