import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

const readClipboard = (page: Page) =>
  page.evaluate(() => navigator.clipboard.readText())

test('copies the selected link URL from the action modal', async ({ page }) => {
  await page.goto('/')
  await page.locator('.social-link-trigger').filter({ hasText: 'ROBLOX' }).click()

  await page.locator('#modal-copy-btn').click()

  await expect(page.getByText('TERSALIN!')).toBeVisible()
  await expect(page.getByRole('status')).toContainText(
    'URL ROBLOX BERHASIL DISALIN!',
  )
  expect(await readClipboard(page)).toBe(
    'https://www.roblox.com/users/7853072759/profile',
  )
})

test('copies the tip URL from the top banner', async ({ page }) => {
  await page.goto('/')

  await page.locator('#copy-tip-btn').click()

  await expect(page.locator('#copy-tip-label')).toHaveText('COPIED!')
  await expect(page.getByRole('status')).toContainText(
    'URL TIPME BERHASIL DISALIN!',
  )
  expect(await readClipboard(page)).toBe('https://ko-fi.com/kairovortex')
})

test('copies the landing page URL from the share menu', async ({ page }) => {
  await page.goto('/')

  await page.locator('#more-toggle-btn').click()
  await page.locator('#share-link-btn').click()

  await expect(page.locator('#share-link-btn')).toContainText('COPIED!')
  await expect(page.getByRole('status')).toContainText(
    'LINK LANDING PAGE BERHASIL DISALIN!',
  )
  expect(await readClipboard(page)).toBe(page.url())
})
