import { expect, test } from '@playwright/test';

test.describe('Home Renewal', () => {
  test('@smoke 데스크톱 홈에서 아티클 5개 페이징과 우측 패널이 보여요', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: '안녕하세요, 우연입니다' })
    ).toBeVisible();

    await page.getByRole('button', { name: '전체 아티클 보기' }).click();

    const articleCards = page.locator('#home-article-list a[href^="/blog/"]');
    await expect(articleCards).toHaveCount(5);

    await expect(page.getByRole('heading', { name: '인기 글' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '아티클 시리즈' })
    ).toBeVisible();
  });

  test('@smoke 홈 시리즈 카드에서 시리즈 상세로 이동해요', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: '전체 아티클 보기' }).click();

    const firstSeriesLink = page
      .locator('aside a[href^="/engineering/series/"]')
      .first();
    await expect(firstSeriesLink).toBeVisible();
    await firstSeriesLink.scrollIntoViewIfNeeded();
    const targetHref = await firstSeriesLink.getAttribute('href');
    expect(targetHref).toMatch(/^\/engineering\/series\/.+/);

    if (!targetHref) {
      throw new Error('시리즈 카드 링크 href를 찾지 못했어요.');
    }

    const response = await page.request.get(targetHref);
    expect(response.ok()).toBeTruthy();

    await page.goto(targetHref);
    await expect(page).toHaveURL(new RegExp(`${targetHref}$`));

    await expect(
      page.getByRole('link', { name: 'Engineering으로 돌아가기' })
    ).toBeVisible();
  });

  test('@smoke 시리즈 상세에서 에피소드를 눌러 글 상세로 이동해요', async ({
    page,
  }) => {
    await page.goto('/engineering/series/redis-deep-dive');

    const firstEpisodeLink = page.locator('main ol a[href^="/blog/"]').first();
    await expect(firstEpisodeLink).toBeVisible();
    const href = await firstEpisodeLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);

    if (!href) {
      throw new Error('시리즈 상세에서 글 링크를 찾지 못했어요.');
    }

    await page.goto(href);
    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
