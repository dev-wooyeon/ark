import { expect, test } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test('고정 paper 테마에서도 모바일 드로어 라벨과 링크가 유지되는지', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 드로어 전용 시나리오'
    );

    await page.goto('/');
    await expect(page.getByRole('button', { name: /모드로 전환/ })).toHaveCount(
      0
    );
    await expect(page.getByRole('button', { name: '검색 열기' })).toHaveCount(
      0
    );

    await page.getByRole('button', { name: '메뉴 열기' }).click();

    const homeItem = page
      .getByLabel('모바일 네비게이션')
      .getByRole('link', { name: /Home/ });
    await expect(homeItem).toBeVisible();
  });

  test('모바일 드로어 링크에 focus-visible 클래스가 유지돼요', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 드로어 전용 시나리오'
    );

    await page.goto('/');
    await page.getByRole('button', { name: '메뉴 열기' }).click();

    const homeItem = page
      .getByLabel('모바일 네비게이션')
      .getByRole('link', { name: /Home/ });

    await homeItem.focus();
    const focusedClass = await homeItem.getAttribute('class');

    expect(focusedClass).toContain(
      'focus-visible:ring-[var(--mobile-nav-focus-ring)]'
    );
    expect(focusedClass).toContain(
      'focus-visible:ring-offset-[var(--mobile-nav-focus-offset)]'
    );
  });
});
