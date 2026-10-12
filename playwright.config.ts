import { defineConfig, devices } from '@playwright/test';

const port = 4180;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: 'browser-integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure', video: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Milliseconds to pause before each browser action, for watching a run: `SLOWMO=700 pnpm test --headed`.
        launchOptions: { slowMo: Number(process.env.SLOWMO) || undefined },
      },
    },
  ],
  webServer: {
    // `--mode test` reads .env.test, which points the app at an API host that doesn't exist. Each test answers it.
    command: `vite build --mode test && vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
  },
});
