import { expect, test } from '@playwright/test';

test.describe('Safe area / mobile drawer layout', () => {
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

  test('모바일 드로어를 열면 배경 스크롤이 잠겨요', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 드로어 전용 시나리오'
    );

    await page.goto('/');
    await page.getByRole('button', { name: '메뉴 열기' }).click();

    const bodyOverflow = await page.evaluate(() => {
      return getComputedStyle(document.body).overflow;
    });

    expect(bodyOverflow).toBe('hidden');
  });
});
