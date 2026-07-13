import { describe, expect, it } from 'vitest';
import { dynamic } from './page';

describe('home route', () => {
  it('renders at request time so popularity data is not frozen at build time', () => {
    expect(dynamic).toBe('force-dynamic');
  });
});
