import { test, expect } from '@playwright/test';

test.describe('Safe area / bottom padding', () => {
  test('하단 빈 공간이 nav 가시성에 맞춰 정리되는지', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      document.body.style.setProperty('--mobile-bottom-nav-offset', '84px');
    });

    const visibleOffset = await page.evaluate(
      () => getComputedStyle(document.body).paddingBottom
    );

    await page.evaluate(() => {
      document.body.style.setProperty('--mobile-bottom-nav-offset', '0px');
    });

    const hiddenOffset = await page.evaluate(
      () => getComputedStyle(document.body).paddingBottom
    );

    expect(visibleOffset).not.toEqual(hiddenOffset);
    expect(visibleOffset.length).toBeGreaterThan(0);
    expect(hiddenOffset.length).toBeGreaterThan(0);
  });

  test('mobile route에서 홈 진입 직후 inset 적용이 남지 않도록', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', {
      name: '모바일 하단 네비게이션',
    });

    await page.evaluate(() => {
      window.scrollTo(0, 160);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);
    const navTransform = await nav.evaluate((el) => getComputedStyle(el).transform);

    expect(navTransform).toContain('matrix(');

    const bottomPadding = await page.evaluate(
      () => getComputedStyle(document.body).paddingBottom
    );
    expect(bottomPadding).not.toMatch(/84px/);
  });
});
