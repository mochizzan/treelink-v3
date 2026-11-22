import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const baseURL = `http://127.0.0.1:${PORT}`
const isCI = Boolean(process.env.CI)
// Optional: point at a preinstalled browser (e.g. PW_BROWSER_CHANNEL=msedge)
// when downloading Playwright's bundled Chromium is not possible.
const channel = process.env.PW_BROWSER_CHANNEL as 'chrome' | 'msedge' | undefined

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // A single worker keeps cold browser starts from making UI assertions flaky.
  workers: 1,
  timeout: 60_000,
  reporter: isCI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report/e2e' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/e2e' }]],
  use: {
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...(channel ? { channel } : {}),
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
})
