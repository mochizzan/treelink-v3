import { expect, test } from '@playwright/test'

test('landing page boots with its core content', async ({ page }) => {
  const pageErrors: Error[] = []
  page.on('pageerror', (error) => pageErrors.push(error))

  const response = await page.goto('/')
  expect(response?.ok()).toBe(true)

  await expect(page).toHaveTitle(/Creator Hub/)
  await expect(page.locator('#top-banner')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'REDA', level: 1 })).toBeVisible()
  await expect(
    page.getByRole('navigation', { name: 'Tautan Sosial Media' }).getByRole('link'),
  ).toHaveCount(3)
  await expect(page.locator('#more-toggle-btn')).toBeVisible()

  expect(pageErrors).toEqual([])
})

test('page is reachable in dark mode from the pre-paint theme script', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('creator-ui-theme', 'dark')
  })

  await page.goto('/')

  await expect(page.locator('html')).toHaveClass(/dark/)
  await expect(
    page.getByRole('heading', { name: 'REDA', level: 1 }),
  ).toBeVisible()
})
