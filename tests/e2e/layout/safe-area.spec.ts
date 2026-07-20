import { expect, test } from '@playwright/test';

test.describe('Safe area / mobile primary navigation', () => {
  test('본문 래퍼에 과한 하단 inset이 남지 않아요', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 레이아웃 전용 시나리오'
    );

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const bottomPadding = await page.locator('main').evaluate((element) => {
      return getComputedStyle(element).paddingBottom;
    });

    expect(parseFloat(bottomPadding)).toBeLessThanOrEqual(40);
  });

  test('모바일 주요 탐색은 드로어와 scroll lock 없이 유지돼요', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 주요 탐색 전용 시나리오'
    );

    await page.goto('/');
    const navigation = page.getByLabel('Ark 주요 탐색');

    const bodyOverflow = await page.evaluate(() => {
      return getComputedStyle(document.body).overflow;
    });

    await expect(navigation.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveCount(0);
    expect(bodyOverflow).not.toBe('hidden');
  });
});
