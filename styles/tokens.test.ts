import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const tokensPath = path.resolve(process.cwd(), 'styles/tokens.css');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');

describe('Ark paper token definitions', () => {
  it('defines a content-first reading scale', () => {
    expect(tokensContent).toContain('--text-base: 1rem;');
    expect(tokensContent).toContain('--text-md: 1.0625rem;');
    expect(tokensContent).toContain('--text-lg: 1.25rem;');
    expect(tokensContent).toContain('--text-meta: 0.75rem;');
    expect(tokensContent).toContain('--text-reading: 0.875rem;');
    expect(tokensContent).toContain('--text-prose-h1: 1.375rem;');
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

  it('uses the Graphite Ink palette instead of dark-mode overrides', () => {
    expect(tokensContent).toContain('--color-bg-primary: #eaebea;');
    expect(tokensContent).toContain('--color-text-primary: #252525;');
    expect(tokensContent).toContain('--color-accent: #3f3f46;');
    expect(tokensContent).toContain('--color-surface: #eaebea;');
    expect(tokensContent).not.toContain('.dark {');
  });

  it('reuses the accent token for mobile navigation focus', () => {
    expect(tokensContent).toContain(
      '--mobile-nav-focus-ring: var(--color-toss-blue);'
    );
  });
});
