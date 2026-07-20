import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layoutPath = path.resolve(process.cwd(), 'app/layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const tossfacePath = path.resolve(process.cwd(), 'styles/tossface.css');
const tossfaceContent = fs.readFileSync(tossfacePath, 'utf8');

describe('root layout font loading', () => {
  it('preloads the primary text font without eagerly loading Tossface', () => {
    expect(layoutContent).toContain('href="/fonts/PretendardVariable.woff2"');
    expect(layoutContent).not.toContain('href="/fonts/TossFaceFontWeb.otf"');
  });

  it('passes only navigation metadata to the app shell', () => {
    expect(layoutContent).toContain('getSortedFeedData().map');
    expect(layoutContent).toContain('<AppProviders>');
    expect(layoutContent).toContain('<AppShell posts={posts}>');
    expect(layoutContent).not.toContain('selectClientPosts');
  });

  it('keeps Tossface demand-driven for matching emoji glyphs', () => {
    expect(layoutContent).toContain("import '@/styles/tossface.css';");
    expect(tossfaceContent).toContain("font-family: 'Tossface Safe';");
    expect(tossfaceContent).toContain('unicode-range:');
  });
});
