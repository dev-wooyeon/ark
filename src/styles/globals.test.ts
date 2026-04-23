import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const globalsPath = path.resolve(process.cwd(), 'src/styles/globals.css');
const globalsContent = fs.readFileSync(globalsPath, 'utf8');
const tokensPath = path.resolve(process.cwd(), 'src/styles/tokens.css');
const tokensContent = fs.readFileSync(tokensPath, 'utf8');

describe('globals styles', () => {
  it('defines mobile navigation state variables at root', () => {
    expect(globalsContent).toContain(':root {');
    expect(globalsContent).toContain('--mobile-bottom-nav-height: 0px;');
    expect(globalsContent).toContain('--mobile-bottom-nav-offset: 0px;');
  });

  it('defines mobile-nav related z-index custom properties', () => {
    expect(tokensContent).toContain('--z-mobile-top-header');
    expect(tokensContent).toContain('--z-mobile-bottom-nav');
  });

  it('supports reduced motion preferences', () => {
    expect(globalsContent).toContain('@media (prefers-reduced-motion: reduce)');
    expect(globalsContent).toContain('animation-duration: 0.01ms !important');
  });

  it('uses Tossface-aware font stack for article prose', () => {
    expect(tokensContent).toContain('--font-sans-emoji:');
    expect(tokensContent).toContain("'Pretendard', 'Tossface Safe'");
    expect(globalsContent).toContain('.prose {');
    expect(globalsContent).toContain('font-family: var(--font-sans-emoji);');
  });
});
