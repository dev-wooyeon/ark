import { expect, test } from '@playwright/test';

function countGridColumns(gridTemplateColumns: string): number {
  return gridTemplateColumns.trim().split(/\s+/).length;
}

test.describe('Resume summary', () => {
  test('@smoke 데스크톱 Resume은 핵심 정보를 4열로 요약해요', async (
    { page },
    testInfo
  ) => {
    test.skip(testInfo.project.use.isMobile, '데스크톱 전용 테스트예요.');

    await page.goto('/resume');

    const labelsGrid = page.locator('main > section > header > div').first();
    const columns = await labelsGrid.evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns;
    });

    const identityGrid = page
      .locator('main > section > header > div')
      .nth(1);

    expect(countGridColumns(columns)).toBe(4);
    await expect(
      page.getByRole('heading', { level: 1, name: '박은우' })
    ).toBeVisible();
    await expect(
      identityGrid.getByText('백엔드 엔지니어', { exact: true })
    ).toBeVisible();
    await expect(
      identityGrid.getByText('데이터 플랫폼', { exact: true })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: '모노리스' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '엑심베이' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '개인 프로젝트' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '데이터 분석 자동화' })
    ).toBeVisible();
    await expect(
      page.getByText(
        '운영 DB를 직접 조회하던 흐름을 CDC 기반 분석 파이프라인으로 바꿔, 1-2시간 걸리던 분석 요청을 즉시 조회할 수 있게 했습니다.'
      )
    ).toBeVisible();
    await expect(page.getByRole('link', { name: '구축기' })).toHaveAttribute(
      'href',
      '/blog/ctr-pipeline'
    );
    await expect(page.getByRole('link', { name: '회고' })).toHaveCount(5);
    await expect(
      page.getByText('해동검도 4단과 세계대회 본선을 준비하며')
    ).toHaveCount(0);
  });

  test('@smoke 모바일 Resume은 요약 정보를 2열로 전환해요', async (
    { page },
    testInfo
  ) => {
    test.skip(
      !testInfo.project.use.isMobile,
      '모바일 프로젝트 전용 테스트예요.'
    );

    await page.goto('/resume');

    const labelsGrid = page.locator('main > section > header > div').first();
    const columns = await labelsGrid.evaluate((element) => {
      return getComputedStyle(element).gridTemplateColumns;
    });

    expect(countGridColumns(columns)).toBe(2);
    await expect(page.getByText('IoT Team', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '백오피스 성능 개선' })
    ).toBeVisible();
  });
});
