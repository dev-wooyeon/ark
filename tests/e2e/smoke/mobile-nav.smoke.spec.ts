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
    await expect(
      navigation.getByRole('link', { name: 'Archive' })
    ).toBeVisible();
    await expect(
      navigation.getByRole('link', { name: 'Resume' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '메뉴 열기' })).toHaveCount(
      0
    );

    await navigation.getByRole('link', { name: 'Archive' }).click();
    await expect(page).toHaveURL(/\/archive/);
  });

  test('모바일 상단 컴팩트 영역에 보조 외부 링크를 둬요', async ({ page }) => {
    await page.goto('/archive');

    const github = page.getByRole('link', { name: 'GitHub' });
    const email = page.getByRole('link', { name: 'Email' });
    const rss = page.getByRole('link', { name: 'RSS' });

    await expect(github).toBeVisible();
    await expect(email).toBeVisible();
    await expect(rss).toBeVisible();

    const githubBox = await github.boundingBox();
    const emailBox = await email.boundingBox();
    if (!githubBox || !emailBox) {
      throw new Error(
        '상단 컴팩트 영역의 외부 링크 위치를 측정할 수 없습니다.'
      );
    }

    expect(githubBox.x).toBeGreaterThan(160);
    expect(githubBox.y).toBeLessThan(120);
    expect(emailBox.y).toBe(githubBox.y);
  });

  test('모바일 홈은 레일과 우측 hero를 분리해 배치해요', async ({ page }) => {
    await page.goto('/');

    const brand = await page
      .getByRole('link', { name: 'ark 홈으로 이동' })
      .boundingBox();
    const statement = await page.locator('main p').boundingBox();
    const resume = await page
      .getByLabel('Ark 주요 탐색')
      .getByRole('link', { name: 'Resume' })
      .boundingBox();
    const github = await page
      .getByRole('link', { name: 'GitHub' })
      .boundingBox();

    if (!brand || !statement || !resume || !github) {
      throw new Error('모바일 그리드 위치를 측정할 수 없습니다.');
    }

    expect(brand.x).toBe(16);
    expect(brand.y).toBe(40);
    expect(statement.x).toBeGreaterThan(100);
    expect(statement.y).toBeLessThan(120);
    expect(resume.x).toBe(16);
    expect(resume.y).toBeGreaterThan(brand.y);
    expect(resume.y).toBeLessThan(240);
    expect(github.x).toBe(16);
    expect(github.y).toBeGreaterThan(resume.y);
  });
});
