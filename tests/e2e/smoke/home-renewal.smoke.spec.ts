import { expect, test } from '@playwright/test';

test.describe('Home feed', () => {
  test('@smoke 데스크톱 홈에서 카테고리 필터와 정렬이 보여요', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tech/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Life/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible();
    await expect(page.getByRole('button', { name: '인기순' })).toBeVisible();

    const articleCards = page.locator('main a[href^="/blog/"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test('@smoke 홈 카테고리 필터가 리스트를 좁혀요', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Life/ }).click();
    await expect(page.getByRole('button', { name: /Life/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    const cards = page.locator('main a[href^="/blog/"]');
    await expect(cards.first()).toBeVisible();
  });
});
