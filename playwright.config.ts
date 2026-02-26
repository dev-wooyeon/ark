import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: {
    timeout: 8_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: {
        browserName: 'chromium',
        ...devices['iPhone 14'],
        colorScheme: 'light',
      },
    },
    {
      name: 'mobile-chrome-dark',
      use: {
        browserName: 'chromium',
        ...devices['iPhone 14'],
        colorScheme: 'dark',
      },
    },
  ],
});
