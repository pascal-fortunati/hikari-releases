import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://127.0.0.1:43124',
    channel: process.env.CI ? 'chromium' : 'chrome',
    headless: true,
    trace: 'retain-on-failure',
  },
  reporter: [['list']],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'node scripts/e2e-server.mjs',
        url: 'http://127.0.0.1:43124/api/health',
        reuseExistingServer: false,
        timeout: 60_000,
      },
});
