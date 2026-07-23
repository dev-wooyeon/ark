import { expect, test } from '@playwright/test';

const TABLE_POST_PATH = '/blog/llm-wiki-build-retrospective';

test.describe('Article shell regression', () => {
  test('mobile articles use the full content column beneath compact navigation', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      'mobile article layout scenario'
    );

    await page.goto(TABLE_POST_PATH);

    const article = page.locator('.ark-article');
    const title = page.locator('.ark-article-title');
    const navigation = page.getByLabel('Ark 주요 탐색');
    const layout = await article.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const prose = element.querySelector('.prose');
      const proseRect = prose?.getBoundingClientRect();

      return {
        articleLeft: rect.left,
        articleRight: rect.right,
        proseLeft: proseRect?.left ?? 0,
        proseRight: proseRect?.right ?? 0,
        viewportWidth: window.innerWidth,
      };
    });

    await expect(title).toBeVisible();
    await expect(navigation).toBeVisible();
    expect(layout.articleLeft).toBe(16);
    expect(layout.articleRight).toBe(layout.viewportWidth - 16);
    expect(layout.proseLeft).toBeGreaterThanOrEqual(layout.articleLeft);
    expect(layout.proseRight).toBeLessThanOrEqual(layout.articleRight);
  });

  test('article entry typography keeps the reading baseline while reducing title contrast', async ({
    page,
  }, testInfo) => {
    await page.goto(TABLE_POST_PATH);

    const typography = await page
      .locator('.ark-article')
      .evaluate((element) => {
        const title = element.querySelector('.ark-article-title');
        const prose = element.querySelector('.prose');

        return {
          titleFontSize: title ? getComputedStyle(title).fontSize : '',
          proseFontSize: prose ? getComputedStyle(prose).fontSize : '',
        };
      });

    expect(typography.titleFontSize).toBe(
      testInfo.project.use.isMobile ? '26px' : '30px'
    );
    expect(typography.proseFontSize).toBe('14px');
  });

  test('wide tables stay inside the mobile article viewport', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'desktop-chrome',
      'mobile article layout scenario'
    );

    await page.goto(TABLE_POST_PATH);

    const table = page.locator('.prose table').first();
    await expect(table).toBeVisible();

    const layout = await table.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);

      return {
        display: style.display,
        overflowX: style.overflowX,
        right: rect.right,
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });

    expect(layout.display).toBe('block');
    expect(layout.overflowX).toBe('auto');
    expect(layout.right).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.scrollWidth).toBeGreaterThan(layout.clientWidth);
  });

  test('reading progress follows the document scroller in the grid shell', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'desktop-chrome',
      'desktop AppShell scroll scenario'
    );

    await page.goto(TABLE_POST_PATH);

    const progress = page.locator('[data-reading-progress]');
    const progressBar = page.locator('[data-reading-progress-bar]');
    await expect(progress).toHaveCSS('opacity', '0');
    await page.evaluate(() => {
      window.scrollTo(0, 600);
      window.dispatchEvent(new Event('scroll'));
    });

    await expect(progress).toHaveCSS('opacity', '1');
    await expect
      .poll(async () => {
        const transform = await progressBar.evaluate(
          (element) => element.style.transform
        );
        const scale = transform.match(/scaleX\(([\d.]+)\)/)?.[1];

        return Number(scale ?? 0);
      })
      .toBeGreaterThan(0);
  });
});
