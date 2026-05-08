import { describe, expect, it } from 'vitest';
import { getNextMotionMode, resolveEffectiveMotionMode } from './motion-mode';

describe('motion-mode', () => {
  it('resolves auto mode with system preference', () => {
    expect(resolveEffectiveMotionMode('auto', false)).toBe('full');
    expect(resolveEffectiveMotionMode('auto', true)).toBe('reduced');
  });

  it('keeps explicit reduced/off modes', () => {
    expect(resolveEffectiveMotionMode('reduced', false)).toBe('reduced');
    expect(resolveEffectiveMotionMode('off', false)).toBe('off');
  });

  it('cycles mode in deterministic order', () => {
    expect(getNextMotionMode('auto')).toBe('reduced');
    expect(getNextMotionMode('reduced')).toBe('off');
    expect(getNextMotionMode('off')).toBe('auto');
  });
});
