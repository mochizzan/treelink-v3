import { defineConfig, devices } from '@playwright/test'

const PORT = 4174
const baseURL = `http://127.0.0.1:${PORT}`
// Optional: point at a preinstalled browser (e.g. PW_BROWSER_CHANNEL=msedge)
// when downloading Playwright's bundled Chromium is not possible.
const channel = process.env.PW_BROWSER_CHANNEL as 'chrome' | 'msedge' | undefined

export default defineConfig({
  testDir: './tests/smoke',
  outputDir: './test-results/smoke',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL,
    headless: true,
    trace: 'off',
    screenshot: 'off',
    ...(channel ? { channel } : {}),
  },
  projects: [
    { name: 'smoke-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
