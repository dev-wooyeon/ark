import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('/feed.xml', () => {
  it('excludes private posts from the generated RSS feed', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('ctr-pipeline');
    expect(xml).not.toContain('fixed-ai-dev-environment');
    expect(xml).not.toContain('algorithm-visualization');
  });
});
