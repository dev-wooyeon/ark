import { test, expect } from '@playwright/test';

test.describe('Storage fallback', () => {
  test('sessionStorage 예외 환경에서 홈 진입이 실패 없이 이루어지는지', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        configurable: true,
        get() {
          throw new Error('Private mode access blocked');
        },
      });
    });

    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await expect(page.getByRole('button', { name: /All/ })).toBeVisible();
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible();
    expect(errors.join('\n')).not.toContain('Failed to set the value');
  });
});
