import { expect, test, type Page } from '@playwright/test';

async function warmRoute(page: Page, path: string) {
  const response = await page.request.get(path);
  expect(response.ok()).toBeTruthy();
}

test.describe('Navigation IA', () => {
  test('@smoke 데스크톱 주요 탐색은 Archive와 Resume만 보여요', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.use.isMobile, '데스크톱 전용 테스트예요.');

    await page.goto('/engineering');

    const navigation = page.getByLabel('Ark 주요 탐색');
    await expect(
      page.getByRole('link', { name: 'ark 홈으로 이동' })
    ).toHaveAttribute('href', '/');
    await expect(navigation.getByRole('link', { name: 'Archive' })).toHaveAttribute(
      'href',
      '/archive'
    );
    await expect(navigation.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      '/resume'
    );
    await expect(navigation.getByRole('link', { name: 'Tech' })).toHaveCount(0);
    await expect(navigation.getByRole('link', { name: 'Life' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'RSS' })).toBeVisible();
  });

  test('@smoke 모바일 상단 링크로 Archive와 Resume로 이동해요', async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');

    const navigation = page.getByLabel('Ark 주요 탐색');
    const archive = navigation.getByRole('link', { name: 'Archive' });
    await expect(archive).toHaveAttribute('href', '/archive');
    await warmRoute(page, '/archive');
    await archive.click();
    await expect(page).toHaveURL(/\/archive/);

    const resume = navigation.getByRole('link', { name: 'Resume' });
    await expect(resume).toHaveAttribute('href', '/resume');
    await warmRoute(page, '/resume');
    await resume.click();
    await expect(page).toHaveURL(/\/resume/);
  });

  test('@smoke /blog는 Archive로 정리되고 기존 상세 글 링크는 유지돼요', async ({
    page,
  }) => {
    const blogResponse = await page.goto('/blog');
    expect(blogResponse?.status()).toBe(200);
    await expect(page).toHaveURL(/\/archive/);

    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();

    const href = await firstPostLink.getAttribute('href');
    expect(href).toMatch(/^\/blog\/.+/);

    if (!href) {
      throw new Error('상세 글 href를 찾지 못했어요.');
    }

    const response = await page.request.get(href);
    expect(response.ok()).toBeTruthy();
  });
});
