import { describe, expect, it } from 'vitest';
import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_KOREAN_NAME,
  SITE_NAME,
  SITE_URL,
  createSiteUrl,
} from '@/site/config/site';
import packageJson from '@/package.json';

describe('site brand', () => {
  it('keeps display names and technical name consistent', () => {
    expect(SITE_BRAND).toEqual({
      englishName: 'Ark',
      koreanName: '아크',
      technicalName: 'ark',
    });
    expect(SITE_NAME).toBe(SITE_BRAND.englishName);
    expect(SITE_KOREAN_NAME).toBe(SITE_BRAND.koreanName);
    expect(packageJson.name).toBe(SITE_BRAND.technicalName);
    expect(SITE_DESCRIPTION).toContain(SITE_BRAND.koreanName);
  });
});

describe('createSiteUrl', () => {
  it('returns canonical absolute URLs without a trailing slash for home', () => {
    expect(createSiteUrl()).toBe(SITE_URL);
    expect(createSiteUrl('/')).toBe(SITE_URL);
    expect(createSiteUrl('/blog/example')).toBe(`${SITE_URL}/blog/example`);
  });
});
