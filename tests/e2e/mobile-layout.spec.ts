import { expect, test } from '@playwright/test'

// A short phone viewport forces the page to scroll, which is when the sticky
// banner and the bottom menu sheet actually change shape.
test.use({ viewport: { width: 390, height: 640 } })

test('donation banner scales down once it pins to the top', async ({ page }) => {
  await page.goto('/')
  const banner = page.locator('#top-banner')
  const expandedHeight = (await banner.boundingBox())?.height ?? 0

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  await expect
    .poll(async () => (await banner.boundingBox())?.height ?? 0)
    .toBeLessThan(expandedHeight - 20)
  expect((await banner.boundingBox())?.y ?? 999).toBeLessThanOrEqual(14)
  // One component throughout: the full copy is still there, just smaller.
  await expect(banner).toContainText('COFFEE // SUPPORT CREATOR')
})

test('keeps the scroll position when the banner pins', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollTo({ top: 16, behavior: 'instant' }))
  await page.waitForTimeout(300)

  expect(await page.evaluate(() => Math.round(scrollY))).toBe(16)
})

test('shrinks gradually instead of swapping layouts', async ({ page }) => {
  await page.goto('/')

  const heights = await page.evaluate(async () => {
    const banner = document.querySelector('#top-banner')!
    const samples: number[] = []
    window.scrollTo({ top: 150, behavior: 'instant' })
    await new Promise<void>((resolve) => {
      let frame = 0
      const tick = () => {
        samples.push(Math.round(banner.getBoundingClientRect().height))
        if (++frame < 24) requestAnimationFrame(tick)
        else resolve()
      }
      requestAnimationFrame(tick)
    })
    return samples
  })

  expect(new Set(heights).size).toBeGreaterThan(3)
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
