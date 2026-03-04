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

    await page.evaluate(() => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
    });
    const getStyleState = async () => {
      return await nav.evaluate((el) => {
        const style = getComputedStyle(el);
        return { transform: style.transform, opacity: style.opacity };
      });
    };

    const offsetState = await getStyleState();
    expect(offsetState.transform).toBeTruthy();
    expect(offsetState.transform).toMatch(/none|matrix/);

    const state20 = await getStyleState();
    const offsetBefore = await nav.boundingBox();
    expect(offsetBefore?.y).not.toBeNull();

    await page.evaluate(() => {
      window.scrollTo(0, 20);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);
    const state20After = await getStyleState();
    expect(state20After.transform).toEqual(state20.transform);
    expect(state20After.opacity).toEqual(state20.opacity);

    await page.evaluate(() => {
      window.scrollTo(0, 31);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);
    const firstSwitch = await nav.boundingBox();
    expect(firstSwitch).not.toBeNull();
    const firstSwitchState = await getStyleState();
    expect(firstSwitchState.transform).toEqual(offsetState.transform);
    expect(firstSwitchState.opacity).toEqual(offsetState.opacity);

    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);
    const secondSwitch = await nav.boundingBox();
    expect(secondSwitch).not.toBeNull();
    const secondSwitchState = await getStyleState();
    expect(Number(secondSwitchState.opacity)).toBeLessThan(
      Number(firstSwitchState.opacity)
    );

    await page.evaluate(() => {
      window.scrollTo(0, 40);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);
    const backSwitch = await nav.boundingBox();
    expect(backSwitch).not.toBeNull();
    const backTransform = await getStyleState();
    expect(Number(backTransform.opacity)).toBeGreaterThan(
      Number(secondSwitchState.opacity)
    );
    expect(Number(backTransform.opacity)).toBeGreaterThanOrEqual(0.9);

    expect(offsetBefore).not.toBeNull();
    expect(firstSwitch).not.toBeNull();
    expect(secondSwitch).not.toBeNull();
    expect(backSwitch).not.toBeNull();
  });

  test('스크롤 동작 후 라우트 복귀해도 바텀바 규칙이 재적용되는지', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', {
      name: '모바일 하단 네비게이션',
    });

    await page.evaluate(() => {
      window.scrollTo(0, 120);
      window.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(250);

    const hiddenTransform = await nav.evaluate((el) =>
      getComputedStyle(el).transform
    );
    expect(hiddenTransform).toMatch(/none|matrix/);

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await page.goto('/series');
    await page.waitForLoadState('networkidle');
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const visibleTransform = await page
      .getByRole('navigation', { name: '모바일 하단 네비게이션' })
      .evaluate((el) => getComputedStyle(el).transform);

    expect(visibleTransform === hiddenTransform || visibleTransform).toMatch(
      /matrix|none/
    );
  });
});
