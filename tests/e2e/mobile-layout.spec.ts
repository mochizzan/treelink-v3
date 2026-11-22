import { expect, test } from '@playwright/test'

// A short phone viewport forces the page to scroll, which is when the sticky
// banner and the bottom menu sheet actually change shape.
test.use({ viewport: { width: 390, height: 640 } })

test('donation banner condenses once it pins to the top', async ({ page }) => {
  await page.goto('/')
  const banner = page.locator('#top-banner')
  const expandedHeight = (await banner.boundingBox())?.height ?? 0

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect
    .poll(async () => (await banner.boundingBox())?.height ?? 0)
    .toBeLessThan(expandedHeight - 40)
  expect((await banner.boundingBox())?.y ?? 999).toBeLessThanOrEqual(14)
})

test('more menu opens without pushing its toggle off screen', async ({ page }) => {
  await page.goto('/')
  const toggle = page.locator('#more-toggle-btn')

  await toggle.click()

  await expect(page.locator('#share-link-btn')).toBeVisible()
  const box = await toggle.boundingBox()
  const viewport = page.viewportSize()
  expect((box?.y ?? 999) + (box?.height ?? 0)).toBeLessThanOrEqual(
    viewport?.height ?? 0,
  )
})
