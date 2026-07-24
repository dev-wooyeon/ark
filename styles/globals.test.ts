import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const globalsPath = path.resolve(process.cwd(), 'styles/globals.css');
const globalsContent = fs.readFileSync(globalsPath, 'utf8');
const mobileViewportPath = path.resolve(
  process.cwd(),
  'styles/viewport/mobile.css'
);
const mobileViewportContent = fs.readFileSync(mobileViewportPath, 'utf8');
const tabletViewportPath = path.resolve(
  process.cwd(),
  'styles/viewport/tablet.css'
);
const tabletViewportContent = fs.readFileSync(tabletViewportPath, 'utf8');
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
    expect(tokensContent).toContain('--text-meta: 0.75rem;');
    expect(tokensContent).toContain('--text-entry: 0.9375rem;');
    expect(tokensContent).toContain('--text-article-title: 1.625rem;');
    expect(tokensContent).toContain('--text-article-title-lg: 1.875rem;');
    expect(tokensContent).toContain('--leading-prose: 1.8;');
    expect(tokensContent).toContain('--text-reading: 0.875rem;');
    expect(globalsContent).toContain('font-size: var(--text-reading);');
    expect(globalsContent).toContain('line-height: var(--leading-prose);');
    expect(mobileViewportContent).toContain('@media (max-width: 639px)');
  });

  it('uses a compact single-column mobile shell and article entry scale', () => {
    expect(mobileViewportContent).toContain(
      "grid-template-areas:\n      'identity'\n      'navigation'\n      'content';"
    );
    expect(globalsContent).toContain('.ark-article-title {');
    expect(globalsContent).toContain('font-size: var(--text-article-title);');
    expect(globalsContent).toContain('.ark-article-meta {');
    expect(globalsContent).toContain(
      '.prose h1 {\n  font-size: var(--text-prose-h1);'
    );
    expect(globalsContent).toContain(
      '.prose h3 {\n  font-size: var(--text-prose-h3);'
    );
  });

  it('uses the sans reading font for the home hero statement', () => {
    expect(globalsContent).toContain('.ark-home-statement {');
    expect(globalsContent).toContain('font-family: var(--font-sans-emoji);');
    expect(globalsContent).toContain('font-size: var(--text-reading);');
    expect(globalsContent).toContain('max-width: 34rem;');
  });

  it('gives the mobile home page a split first-entry layout', () => {
    expect(mobileViewportContent).toContain(
      ".ark-site-grid[data-page-layout='home']"
    );
    expect(mobileViewportContent).toContain(
      "'identity content'\n      'navigation content'\n      'external content'"
    );
    expect(mobileViewportContent).toContain(
      'grid-template-rows: auto auto minmax(0, 1fr);'
    );
    expect(mobileViewportContent).toContain('margin-bottom: var(--space-8);');
    expect(mobileViewportContent).toContain(
      ".ark-site-grid[data-page-layout='home'] .ark-site-identity {\n    display: contents;"
    );
  });

  it('keeps the desktop identity, content, and navigation columns together', () => {
    expect(globalsContent).toContain(
      'grid-template-columns: minmax(0, 2fr) minmax(0, 6fr) minmax(0, 4fr);'
    );
    expect(globalsContent).not.toContain(
      '@media (min-width: 768px) and (max-width: 1199px)'
    );
  });

  it('gives the active primary link a non-color state', () => {
    expect(globalsContent).toContain(
      ".ark-site-primary-link[aria-current='page']"
    );
    expect(globalsContent).toContain('font-weight: var(--font-semibold);');
  });

  it('uses the content-page rail layout across non-mobile viewports', () => {
    const contentViewportPath = path.resolve(
      process.cwd(),
      'styles/viewport/content.css'
    );
    const contentViewport = fs.readFileSync(contentViewportPath, 'utf8');

    expect(contentViewport).toContain('@media (min-width: 640px)');
    expect(contentViewport).toContain(
      ".ark-site-grid[data-page-layout='content']"
    );
    expect(contentViewport).toContain(
      'grid-template-columns: minmax(0, 2fr) minmax(0, 8fr);'
    );
    expect(contentViewport).toContain('grid-column: 1;');
    expect(contentViewport).toContain(
      ".ark-site-grid[data-page-layout='content'] .ark-article {\n    padding-top: 0;"
    );
  });

  it('matches hero and primary navigation sizes at intermediate widths', () => {
    expect(tabletViewportContent).toContain(
      '@media (min-width: 640px) and (max-width: 1199px)'
    );
    expect(tabletViewportContent).toContain(
      '  .ark-home-statement {\n    font-weight: var(--font-medium-plus);'
    );
    expect(tabletViewportContent).toContain(
      '  .ark-site-primary-link {\n    font-size: var(--text-sm);'
    );
  });

  it('uses semantic surface tokens for article content', () => {
    expect(globalsContent).toContain('color: var(--color-text-secondary);');
    expect(globalsContent).toContain(
      'background-color: var(--color-bg-secondary);'
    );
    expect(globalsContent).toContain('border-radius: var(--radius-content);');
  });

  it('keeps wide article tables scrollable on mobile', () => {
    expect(mobileViewportContent).toMatch(
      /@media \(max-width: 639px\)[\s\S]*\.prose table \{[\s\S]*display: block;[\s\S]*overflow-x: auto;/
    );
  });

  it('defines high contrast color overrides', () => {
    expect(tokensContent).toContain('@media (prefers-contrast: more)');
    expect(globalsContent).toContain('@media (prefers-contrast: more)');
  });
});
