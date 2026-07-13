import { expect, test } from '@playwright/test';

test.describe('Home feed', () => {
  test('@smoke 데스크톱 홈에서 카테고리 필터와 최신 글이 보여요', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('button', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Tech/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Life/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '최신순' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '인기순' })).toHaveCount(0);

    const articleCards = page.locator('main a[href^="/blog/"]');
    await expect(articleCards.first()).toBeVisible();
  });

  test('@smoke 홈 카테고리 필터가 리스트를 좁혀요', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Life/ }).click();
    await expect(page.getByRole('button', { name: /Life/ })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    const cards = page.locator('main a[href^="/blog/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('@smoke 모바일 홈은 글 카드에 16px 좌우 거터를 사용해요', async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');

    const firstCard = page.locator('main a[href^="/blog/"]').first();
    await expect(firstCard).toBeVisible();

    const box = await firstCard.boundingBox();

    if (!box) {
      throw new Error('첫 글 카드의 위치를 측정할 수 없습니다.');
    }

    expect(box.x).toBe(16);
  });
});
