import { test, expect } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test('@smoke 홈 진입 즉시 하단 내비 표시', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', {
      name: '모바일 하단 네비게이션',
    });

    await expect(nav).toBeVisible();

    const rectBefore = await nav.boundingBox();
    expect(rectBefore).not.toBeNull();
    expect(rectBefore?.y).toBeGreaterThan(0);

    const transform = await nav.evaluate((el) => getComputedStyle(el).transform);
    expect(transform === 'none' || transform.includes('matrix')).toBeTruthy();
  });

  test('스크롤 0/20/31/100에서 하단바 상태가 일관되게 전환되는지', async ({
    page,
  }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', {
      name: '모바일 하단 네비게이션',
    });

    const getBottomOffset = () =>
      page.evaluate(() =>
        document.body.style.getPropertyValue('--mobile-bottom-nav-offset').trim()
      );

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    await page.evaluate(() => {
      window.scrollTo(0, 20);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    await page.evaluate(() => {
      window.scrollTo(0, 31);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('0px');

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    const finalTransform = await nav.evaluate((el) => getComputedStyle(el).transform);
    expect(finalTransform).toMatch(/none|matrix/);
  });

  test('스크롤 동작 후 라우트 복귀해도 바텀바 규칙이 재적용되는지', async ({ page }) => {
    await page.goto('/');
    const getBottomOffset = () =>
      page.evaluate(() =>
        document.body.style.getPropertyValue('--mobile-bottom-nav-offset').trim()
      );

    await page.evaluate(() => {
      window.scrollTo(0, 120);
      window.dispatchEvent(new Event('scroll'));
    });
    await expect.poll(getBottomOffset).toBe('0px');

    await page.goto('/engineering');
    await page.waitForLoadState('networkidle');
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    await page.goto('/life');
    await page.waitForLoadState('networkidle');
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect.poll(getBottomOffset).toBe('var(--mobile-bottom-nav-height)');
  });
});
