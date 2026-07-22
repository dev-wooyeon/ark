import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const globalsPath = path.resolve(process.cwd(), 'styles/globals.css');
const globalsContent = fs.readFileSync(globalsPath, 'utf8');
const tokensPath = path.resolve(process.cwd(), 'styles/tokens.css');
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

  it('keeps body color transitions scoped instead of animating every element', () => {
    expect(globalsContent).toContain(
      'background-color var(--duration-150) var(--ease-default)'
    );
    expect(globalsContent).not.toMatch(
      /\*,\s*\*::before,\s*\*::after\s*\{[^}]*transition-property:/
    );
  });

  it('uses Tossface-aware font stack for article prose', () => {
    expect(tokensContent).toContain('--font-sans-emoji:');
    expect(tokensContent).toContain("'Pretendard', 'Tossface Safe'");
    expect(globalsContent).toContain('.prose {');
    expect(globalsContent).toContain('font-family: var(--font-sans-emoji);');
  });

  it('uses mobile-readable prose sizing and spacing tokens', () => {
    expect(tokensContent).toContain('--leading-prose: 1.72;');
    expect(tokensContent).toContain('--text-reading: 1.0625rem;');
    expect(globalsContent).toContain('font-size: var(--text-reading);');
    expect(globalsContent).toContain('line-height: var(--leading-prose);');
    expect(globalsContent).toContain('@media (max-width: 767px)');
  });

  it('uses semantic surface tokens for article content', () => {
    expect(globalsContent).toContain('color: var(--color-text-secondary);');
    expect(globalsContent).toContain(
      'background-color: var(--color-bg-secondary);'
    );
    expect(globalsContent).toContain('border-radius: var(--radius-content);');
  });

  it('keeps wide article tables scrollable on mobile', () => {
    expect(globalsContent).toMatch(
      /@media \(max-width: 767px\)[\s\S]*\.prose table \{[\s\S]*display: block;[\s\S]*overflow-x: auto;/
    );
  });

  it('defines high contrast color overrides', () => {
    expect(tokensContent).toContain('@media (prefers-contrast: more)');
    expect(globalsContent).toContain('@media (prefers-contrast: more)');
  });
});
