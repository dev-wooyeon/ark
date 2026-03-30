import { expect, test, type Page } from '@playwright/test';

async function warmRoute(page: Page, path: string) {
  const response = await page.request.get(path);
  expect(response.ok()).toBeTruthy();
}

test.describe('Navigation IA', () => {
  test('@smoke 모바일 하단 네비 4탭이 동작해요', async ({ page }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');
    await expect(
      page.getByRole('navigation', { name: '모바일 하단 네비게이션' })
    ).toBeVisible();

    const nav = page.getByRole('navigation', {
      name: '모바일 하단 네비게이션',
    });

    const engineeringTab = nav.getByRole('link', {
      name: 'Engineering',
      exact: true,
    });
    await expect(engineeringTab).toHaveAttribute('href', '/engineering');
    await warmRoute(page, '/engineering');
    await page.goto('/engineering');
    await expect(page).toHaveURL(/\/engineering/);

    await page.goto('/');
    const lifeTab = nav.getByRole('link', { name: 'Life', exact: true });
    await expect(lifeTab).toHaveAttribute('href', '/life');
    await warmRoute(page, '/life');
    await page.goto('/life');
    await expect(page).toHaveURL(/\/life/);

    await page.goto('/');
    const resumeTab = nav.getByRole('link', { name: 'Resume', exact: true });
    await expect(resumeTab).toHaveAttribute('href', '/resume');
    await warmRoute(page, '/resume');
    await page.goto('/resume');
    await expect(page).toHaveURL(/\/resume/);

    await page.goto('/engineering');
    const homeTab = nav.getByRole('link', { name: '홈', exact: true });
    await expect(homeTab).toHaveAttribute('href', '/');
    await page.goto('/');
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

    await page.goto(href);
    await expect(page).toHaveURL(/\/blog\/.+/);
  });
});
