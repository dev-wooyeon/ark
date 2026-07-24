import { expect, test } from '@playwright/test';

test.describe('Home and archive', () => {
  test('@smoke 데스크톱 홈은 2:6:4 세 열 그리드를 사용해요', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.use.isMobile, '데스크톱 전용 테스트예요.');

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
      throw new Error('데스크톱 그리드 위치를 측정할 수 없습니다.');
    }

    expect(brand.x).toBe(32);
    expect(brand.y).toBe(40);
    expect(statement.x).toBe(288);
    expect(statement.y).toBe(40);
    expect(resume.x).toBe(976);
    expect(resume.y).toBe(40);
  });

  test('@smoke 홈은 철학 문장과 두 핵심 경로를 먼저 보여요', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.locator('main p').filter({
        hasText:
          'Building backend systems with less complexity and more trust.',
      })
    ).toBeVisible();
    const serviceLink = page.getByRole('link', { name: '@9.81park' });
    await expect(serviceLink).toBeVisible();
    await expect(serviceLink).toHaveAttribute(
      'href',
      'https://www.981park.com'
    );
    await expect(serviceLink).toHaveAttribute('target', '_blank');

    const statementFont = await page.locator('main p').evaluate((element) => {
      return getComputedStyle(element).fontFamily;
    });
    expect(statementFont).toContain('Pretendard');

    const navigation = page.getByLabel('Ark 주요 탐색');
    await expect(
      navigation.getByRole('link', { name: 'Archive' })
    ).toBeVisible();
    await expect(
      navigation.getByRole('link', { name: 'Resume' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /All/ })).toHaveCount(0);
    await expect(page.locator('main a[href^="/blog/"]')).toHaveCount(0);
  });

  test('좁은 데스크톱에서도 hero와 주요 탐색을 분리해요', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.use.isMobile, '데스크톱 전용 테스트예요.');

    await page.setViewportSize({ width: 855, height: 900 });
    await page.goto('/');

    const grid = page.locator('.ark-site-grid');
    const statement = await page.locator('main p').boundingBox();
    const resume = await page
      .getByLabel('Ark 주요 탐색')
      .getByRole('link', { name: 'Resume' })
      .boundingBox();
    const archive = await page
      .getByLabel('Ark 주요 탐색')
      .getByRole('link', { name: 'Archive' })
      .boundingBox();

    if (!statement || !resume || !archive) {
      throw new Error('좁은 데스크톱 레이아웃 위치를 측정할 수 없습니다.');
    }

    const columns = await grid.evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/);
    });

    expect(columns).toHaveLength(3);
    expect(resume.x).toBeGreaterThan(statement.x + (statement.width ?? 0));
    expect(archive.x).toBe(resume.x);
    expect(archive.y).toBeGreaterThan(resume.y);
    const typography = await page.evaluate(() => {
      const statement = document.querySelector('main p');
      const resume = document.querySelector('[aria-label="Ark 주요 탐색"] a');

      return {
        statement: statement ? getComputedStyle(statement).fontSize : '',
        resume: resume ? getComputedStyle(resume).fontSize : '',
      };
    });

    expect(typography.statement).toBe('14px');
    expect(typography.resume).toBe('14px');
  });

  test('@smoke Archive는 날짜와 제목만의 글 목록을 제공해요', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/archive');

    const postLinks = page.locator('main a[href^="/blog/"]');
    await expect(postLinks.first()).toBeVisible();
    await expect(page.getByRole('button', { name: /All/ })).toHaveCount(0);

    const firstPost = await postLinks.nth(0).boundingBox();
    const secondPost = await postLinks.nth(1).boundingBox();

    if (!firstPost || !secondPost) {
      throw new Error('Archive 행 간격을 측정할 수 없습니다.');
    }

    await expect
      .poll(async () => {
        const currentFirstPost = await postLinks.nth(0).boundingBox();
        const currentSecondPost = await postLinks.nth(1).boundingBox();

        if (!currentFirstPost || !currentSecondPost) {
          return 0;
        }

        return currentSecondPost.y - currentFirstPost.y;
      })
      .toBeGreaterThan(firstPost.height);

    if (!test.info().project.use.isMobile) {
      const github = await page
        .getByRole('link', { name: 'GitHub' })
        .boundingBox();

      if (!github) {
        throw new Error(
          '데스크톱 identity rail의 GitHub 위치를 측정할 수 없습니다.'
        );
      }

      expect(github.x).toBe(32);
      expect(github.y).toBe(788);
    }
  });

  test('@smoke 모바일 홈에서도 Archive와 Resume을 바로 찾을 수 있어요', async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/');

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

    const resume = await navigation
      .getByRole('link', { name: 'Resume' })
      .boundingBox();
    const archive = await navigation
      .getByRole('link', { name: 'Archive' })
      .boundingBox();

    expect(resume).not.toBeNull();
    expect(archive).not.toBeNull();
    expect(resume?.y).toBeLessThan(160);
    expect(archive?.x).toBe(resume?.x);
    expect(archive?.y).toBeGreaterThan(resume?.y ?? 0);
  });
});
