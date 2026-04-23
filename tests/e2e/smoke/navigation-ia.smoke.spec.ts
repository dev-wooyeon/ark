import { expect, test, type Page } from '@playwright/test';

async function warmRoute(page: Page, path: string) {
  const response = await page.request.get(path);
  expect(response.ok()).toBeTruthy();
}

async function openDrawer(page: Page) {
  await page.getByRole('button', { name: '메뉴 열기' }).click();
  await expect(page.locator('#mobile-nav-drawer')).toHaveClass(/translate-x-0/);
}

test.describe('Navigation IA', () => {
  test('@smoke 모바일 드로어에서 Tech로 이동해요', async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');
    await openDrawer(page);

    const techTab = page.getByLabel('모바일 네비게이션').getByRole('link', {
      name: /Tech/,
    });
    await expect(techTab).toHaveAttribute('href', '/engineering');
    await warmRoute(page, '/engineering');
    await techTab.click();
    await expect(page).toHaveURL(/\/engineering/);
  });

  test('모바일 드로어에서 Life로 이동해요', async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');
    await openDrawer(page);

    const lifeTab = page.getByLabel('모바일 네비게이션').getByRole('link', {
      name: /Life/,
    });
    await expect(lifeTab).toHaveAttribute('href', '/life');
    await warmRoute(page, '/life');
    await lifeTab.click();
    await expect(page).toHaveURL(/\/life/);
  });

  test('모바일 드로어에서 Resume로 이동해요', async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');
    await openDrawer(page);

    const resumeTab = page.getByLabel('모바일 네비게이션').getByRole('link', {
      name: /Resume/,
    });
    await expect(resumeTab).toHaveAttribute('href', '/resume');
    await warmRoute(page, '/resume');
    await resumeTab.click();
    await expect(page).toHaveURL(/\/resume/);
  });

  test('모바일 드로어에서 Home으로 이동해요', async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/engineering');
    await openDrawer(page);

    const homeTab = page.getByLabel('모바일 네비게이션').getByRole('link', {
      name: /Home/,
    });
    await expect(homeTab).toHaveAttribute('href', '/');
    await homeTab.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('@smoke /blog와 /series는 새 경로로 리다이렉트돼요', async ({
    page,
  }) => {
    const blogResponse = await page.goto('/blog');
    expect(blogResponse?.status()).toBe(200);
    await expect(page).toHaveURL(/\/engineering/);

    const seriesResponse = await page.goto('/series');
    expect(seriesResponse?.status()).toBe(200);
    await expect(page).toHaveURL(/\/engineering\?type=series/);
  });

  test('@smoke 기존 상세 글 링크는 유지돼요', async ({ page }) => {
    await page.goto('/engineering');

    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();

    const href = await firstPostLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/blog\/.+/);

    if (!href) {
      throw new Error('상세 글 href를 찾지 못했어요.');
    }

    const response = await page.request.get(href);
    expect(response.ok()).toBeTruthy();
  });
});
