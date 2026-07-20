import { expect, test } from '@playwright/test';

test.describe('Mobile navigation', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );
  });

  test('@smoke 홈 상단에서 두 핵심 목적지를 바로 열 수 있어요', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('link', { name: 'ark 홈으로 이동' })
    ).toBeVisible();
    const navigation = page.getByLabel('Ark 주요 탐색');
    await expect(navigation.getByRole('link', { name: 'Archive' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Resume' })).toBeVisible();
    await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveCount(0);

    await navigation.getByRole('link', { name: 'Archive' }).click();
    await expect(page).toHaveURL(/\/archive/);
  });

  test('모바일 좌측 레일 하단에는 보조 외부 링크를 둬요', async ({ page }) => {
    await page.goto('/archive');

    const github = page.getByRole('link', { name: 'GitHub' });
    const email = page.getByRole('link', { name: 'Email' });
    const rss = page.getByRole('link', { name: 'RSS' });

    await expect(github).toBeVisible();
    await expect(email).toBeVisible();
    await expect(rss).toBeVisible();

    const githubBox = await github.boundingBox();
    const emailBox = await email.boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);

    if (!githubBox || !emailBox) {
      throw new Error('좌측 레일의 외부 링크 위치를 측정할 수 없습니다.');
    }

    expect(githubBox.x).toBe(16);
    expect(githubBox.y).toBe(viewportHeight - 112);
    expect(emailBox.y).toBe(viewportHeight - 88);
  });

  test('모바일은 참조 그리드처럼 소개와 주요 링크를 나눠 놓아요', async ({
    page,
  }) => {
    await page.goto('/');

    const brand = await page
      .getByRole('link', { name: 'ark 홈으로 이동' })
      .boundingBox();
    const statement = await page.locator('main p').boundingBox();
    const resume = await page
      .getByLabel('Ark 주요 탐색')
      .getByRole('link', { name: 'Resume' })
      .boundingBox();

    if (!brand || !statement || !resume) {
      throw new Error('모바일 그리드 위치를 측정할 수 없습니다.');
    }

    expect(brand.x).toBe(16);
    expect(brand.y).toBe(40);
    expect(statement.x).toBeCloseTo(120, 0);
    expect(statement.y).toBe(40);
    expect(resume.x).toBe(16);
    expect(resume.y).toBe(128);
  });
});
