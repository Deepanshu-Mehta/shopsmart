const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,
  globalSetup: './global-setup.js',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Option 1 (local dev): reuseExistingServer:true lets you run the real server + client
  //   yourself before running `npx playwright test`.
  // Option 2 (CI): when nothing is running, Playwright starts both automatically.
  webServer: [
    {
      command: 'npm run dev',
      cwd: '../server',
      url: 'http://localhost:5001/api/health',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      cwd: '../client',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
