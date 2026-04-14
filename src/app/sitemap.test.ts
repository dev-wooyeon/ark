import { describe, expect, it } from 'vitest';
import sitemap from './sitemap';

const URL = 'https://eunu-log.vercel.app';

describe('sitemap', () => {
  it('excludes private posts from sitemap entries', () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${URL}/blog/ctr-pipeline`);
    expect(urls).not.toContain(`${URL}/blog/fixed-ai-dev-environment`);
    expect(urls).not.toContain(`${URL}/blog/algorithm-visualization`);
  });
});
