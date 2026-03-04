import { expect, test } from '@playwright/test';

test.describe('Navigation IA', () => {
  test('@smoke 모바일 하단 네비 4탭이 동작해요', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('navigation', { name: '모바일 하단 네비게이션' })
    ).toBeVisible();

    await page
      .getByRole('navigation', { name: '모바일 하단 네비게이션' })
      .locator('a[href="/engineering"]')
      .click();
    await expect(page).toHaveURL(/\/engineering/);

    await page.goto('/');
    await page
      .getByRole('navigation', { name: '모바일 하단 네비게이션' })
      .locator('a[href="/life"]')
      .click();
    await expect(page).toHaveURL(/\/life/);

    await page.goto('/');
    await page
      .getByRole('navigation', { name: '모바일 하단 네비게이션' })
      .locator('a[href="/resume"]')
      .click();
    await expect(page).toHaveURL(/\/resume/);

    await page.goto('/engineering');
    await page
      .getByRole('navigation', { name: '모바일 하단 네비게이션' })
      .locator('a[href="/"]')
      .click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('@smoke /blog와 /series는 새 경로로 리다이렉트돼요', async ({ page }) => {
    const blogResponse = await page.goto('/blog');
    expect(blogResponse?.status()).toBe(200);
    await expect(page).toHaveURL(/\/engineering/);

    const seriesResponse = await page.goto('/series');
    expect(seriesResponse?.status()).toBe(200);
    await expect(page).toHaveURL(/\/engineering\?type=series/);
  });

  test('@smoke 기존 상세 글 링크는 유지돼요', async ({ page }) => {
    await page.goto('/engineering');

    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();

    const href = await firstPostLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/blog\/.+/);

    if (!href) {
      throw new Error('상세 글 href를 찾지 못했어요.');
    }

    await page.goto(href);
    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
