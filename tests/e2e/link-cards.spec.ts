import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const card = (page: Page, platform: string) =>
  page.locator('.social-link-trigger').filter({ hasText: platform })

// The modal stays mounted while closed, so use a CSS locator: an aria-hidden
// dialog drops out of the accessibility tree and getByRole would stop finding it.
const modal = (page: Page) =>
  page.locator('[role="dialog"][aria-modal="true"]')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('renders every social link card', async ({ page }) => {
  const nav = page.getByRole('navigation', { name: 'Tautan Sosial Media' })

  await expect(nav.getByRole('link')).toHaveCount(3)
  for (const platform of ['TIKTOK', 'DISCORD', 'ROBLOX']) {
    await expect(card(page, platform)).toBeVisible()
  }
})

test('opens the action modal for the selected platform', async ({ page }) => {
  await card(page, 'DISCORD').click()

  const dialog = modal(page)
  await expect(dialog).toHaveAttribute('aria-hidden', 'false')
  await expect(dialog.getByText(/PILIH AKSI \/\/ DISCORD/)).toBeVisible()
  await expect(dialog.locator('#modal-copy-btn')).toBeVisible()
  await expect(dialog.locator('#modal-direct-link')).toHaveAttribute(
    'href',
    'https://discord.gg/2MrwTkZJZC',
  )
})

test('closes the modal with Escape', async ({ page }) => {
  await card(page, 'TIKTOK').click()
  const dialog = modal(page)
  await expect(dialog).toHaveAttribute('aria-hidden', 'false')

  await page.keyboard.press('Escape')

  await expect(dialog).toHaveAttribute('aria-hidden', 'true')
})

test('closes the modal with its close button', async ({ page }) => {
  await card(page, 'ROBLOX').click()
  const dialog = modal(page)

  await dialog.locator('#modal-close-btn').click()

  await expect(dialog).toHaveAttribute('aria-hidden', 'true')
})

test('closes the modal when the backdrop is clicked', async ({ page }) => {
  await card(page, 'ROBLOX').click()
  const dialog = modal(page)

  await dialog.click({ position: { x: 4, y: 4 } })

  await expect(dialog).toHaveAttribute('aria-hidden', 'true')
})

test('DIRECT opens the real target in a new tab and dismisses the modal', async ({
  page,
  context,
}) => {
  // Stub the external destination so the test never depends on network access.
  await context.route('https://www.tiktok.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>TikTok destination</title>',
    }),
  )

  await card(page, 'TIKTOK').click()
  const dialog = modal(page)
  const directLink = dialog.locator('#modal-direct-link')

  await expect(directLink).toHaveAttribute('target', '_blank')
  await expect(directLink).toHaveAttribute(
    'href',
    'https://www.tiktok.com/@.onlyreda?_r=1&_t=ZS-9BbaOft4dcq',
  )

  const [popup] = await Promise.all([
    context.waitForEvent('page'),
    directLink.click(),
  ])
  await popup.waitForLoadState('domcontentloaded')

  expect(popup.url()).toContain('tiktok.com/@.onlyreda')
  await expect(dialog).toHaveAttribute('aria-hidden', 'true')
  await popup.close()
})
