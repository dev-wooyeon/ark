import { expect, test } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!testInfo.project.use.isMobile, '모바일 프로젝트 전용 테스트예요.');
  });

  test('@smoke 홈 진입 시 메뉴 버튼으로 모바일 드로어를 열 수 있어요', async ({
    page,
  }) => {
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: '메뉴 열기' });
    await expect(menuButton).toBeVisible();

    await menuButton.click();

    const nav = page.getByLabel('모바일 네비게이션');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: /Home/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Tech/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Life/ })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Resume/ })).toBeVisible();
  });

  test('모바일 드로어는 닫기 버튼으로 닫혀요', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '메뉴 열기' }).click();

    const nav = page.locator('#mobile-nav-drawer');
    await expect(nav).toHaveClass(/translate-x-0/);

    await nav.getByRole('button', { name: '메뉴 닫기' }).click();
    await expect(nav).toHaveClass(/-translate-x-full/);
  });

  test('모바일 드로어에서 이동하면 자동으로 닫혀요', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '메뉴 열기' }).click();

    const nav = page.locator('#mobile-nav-drawer');
    await nav.getByRole('link', { name: /Tech/ }).click();

    await expect(page).toHaveURL(/\/engineering/);
    await expect(nav).toHaveClass(/-translate-x-full/);
  });

  test('모바일에서 홈 본문 하단 여백이 과하게 남지 않아요', async ({ page }) => {
    await page.goto('/');

    const bottomPadding = await page.locator('main').evaluate((element) => {
      return getComputedStyle(element).paddingBottom;
    });

    expect(parseFloat(bottomPadding)).toBeLessThanOrEqual(40);
  });
});
