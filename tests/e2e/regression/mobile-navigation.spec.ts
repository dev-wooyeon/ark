import { expect, test } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test('고정 paper 테마에서도 상단 주요 링크가 유지되는지', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 주요 탐색 전용 시나리오'
    );

    await page.goto('/');
    await expect(page.getByRole('button', { name: /모드로 전환/ })).toHaveCount(
      0
    );
    await expect(page.getByRole('button', { name: '검색 열기' })).toHaveCount(
      0
    );

    const navigation = page.getByLabel('Ark 주요 탐색');
    await expect(navigation.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Resume' })).toBeVisible();
  });

  test('모바일 주요 링크에 focus-visible 클래스가 유지돼요', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      '모바일 주요 탐색 전용 시나리오'
    );

    await page.goto('/');

    const archive = page
      .getByLabel('Ark 주요 탐색')
      .getByRole('link', { name: 'Archive' });

    await archive.focus();
    const focusedClass = await archive.getAttribute('class');

    expect(focusedClass).toContain(
      'focus-visible:ring-[var(--color-toss-blue)]'
    );
    expect(focusedClass).toContain(
      'focus-visible:ring-offset-[var(--color-bg-primary)]'
    );
  });
});
