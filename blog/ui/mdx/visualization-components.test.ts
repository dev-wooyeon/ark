import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const visualizationNames = [
  'BinarySearchVisualization',
  'DPVisualization',
  'GraphTraversalVisualization',
  'SlidingWindowVisualization',
  'SortingVisualization',
  'TwoPointerVisualization',
] as const;

const loaderPath = path.resolve(
  process.cwd(),
  'blog/ui/mdx/visualization-components.tsx'
);
const loaderContent = fs.readFileSync(loaderPath, 'utf8');
const postPath = path.resolve(process.cwd(), 'posts/알고리즘-시각화/index.mdx');
const postContent = fs.readFileSync(postPath, 'utf8');

describe('MDX visualization loading boundary', () => {
  it('loads each heavy visualization through its own dynamic import', () => {
    expect(loaderContent).toContain("'use client';");
    expect(loaderContent).toContain('lazy(loader)');
    expect(loaderContent).not.toContain("from 'next/dynamic'");
    expect(loaderContent).not.toContain("import('@/blog/ui/visualization')");

    for (const name of visualizationNames) {
      expect(loaderContent).toContain(
        `import('@/blog/ui/visualization/${name}')`
      );
    }
  });

  it('opts the visualization post into the heavy component bundle', () => {
    expect(postContent).toContain(
      "from '@/blog/ui/mdx/visualization-components';"
    );

    for (const name of visualizationNames) {
      expect(postContent).toContain(`<${name} />`);
    }
  });
});
