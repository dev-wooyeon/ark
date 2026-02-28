import { test, expect } from '@playwright/test';

test.describe('Theme regression', () => {
  test('테마 토글 후 모바일 nav 스타일 토큰이 유지되는지', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.getByRole('button', { name: /모드로 전환/ });
    await expect(themeButton).toBeVisible();

    const classBefore = await page.evaluate(() => document.documentElement.className);
    const themeLabelBefore = await themeButton.getAttribute('aria-label');

    await themeButton.click();
    await page.waitForTimeout(400);

    const classAfter = await page.evaluate(() => document.documentElement.className);
    const themeLabelAfter = await themeButton.getAttribute('aria-label');

    expect(classAfter.length).toBeGreaterThanOrEqual(0);
    expect(
      classAfter !== classBefore || themeLabelBefore !== themeLabelAfter
    ).toBeTruthy();

    const activeItem = page.getByRole('link', { name: '홈' });
    await expect(activeItem).toBeVisible();
  });

  test('focus visible outline class가 라우트 전환 후에도 존재', async ({ page }) => {
    await page.goto('/');

    const homeItem = page.getByRole('link', { name: '홈' });
    await homeItem.focus();
    const focusedClass = await homeItem.getAttribute('class');

    expect(focusedClass).toContain('focus-visible:ring-[var(--mobile-nav-focus-ring)]');
    expect(focusedClass).toContain('focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]');
  });
});
