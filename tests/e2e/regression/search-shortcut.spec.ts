import { expect, test } from '@playwright/test';

test.describe('Search shortcut', () => {
  test('/ 단축키로 검색창이 열린 상태를 유지해요', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('/');

    const searchInput = page.getByRole('combobox', {
      name: /검색어|태그|글 제목/,
    });

    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });
});
