import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const tokensPath = path.resolve(process.cwd(), 'styles/tokens.css');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');

describe('TDS token definitions', () => {
  it('defines a content-first reading scale', () => {
    expect(tokensContent).toContain('--text-base: 1rem;');
    expect(tokensContent).toContain('--text-md: 1.0625rem;');
    expect(tokensContent).toContain('--text-lg: 1.25rem;');
    expect(tokensContent).toContain('--text-meta: 0.8125rem;');
    expect(tokensContent).toContain('--text-reading: 1.0625rem;');
  });

  it('defines semantic radius roles for actions, content, and selections', () => {
    expect(tokensContent).toContain('--radius-action:');
    expect(tokensContent).toContain('--radius-content:');
    expect(tokensContent).toContain('--radius-selection:');
  });

  it('defines mobile bottom nav tokens in root theme', () => {
    expect(tokensContent).toContain('--mobile-nav-active-text');
    expect(tokensContent).toContain('--mobile-nav-active-bg');
    expect(tokensContent).toContain('--mobile-nav-active-border');
    expect(tokensContent).toContain('--mobile-nav-hover-bg');
    expect(tokensContent).toContain('--mobile-nav-focus-ring');
    expect(tokensContent).toContain('--mobile-nav-focus-offset');
  });

  it('defines dark-mode mobile nav overrides', () => {
    expect(tokensContent).toContain('.dark {');
    expect(tokensContent).toContain('--mobile-nav-hover-bg:');
    expect(tokensContent).toContain('--mobile-nav-focus-ring:');
  });

  it('reuses tokenized focus ring in both themes', () => {
    expect(tokensContent).toMatch(/--mobile-nav-focus-ring:[^}]*;/);
    const lightMatch = tokensContent.match(
      /--mobile-nav-focus-ring:\s*var\(--color-toss-blue\);/g
    );
    const darkMatch = tokensContent.match(
      /--mobile-nav-focus-ring:\s*#6bb3ff;/g
    );

    expect(lightMatch).not.toBeNull();
    expect(darkMatch).not.toBeNull();
  });
});
