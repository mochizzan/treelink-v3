import { expect, test } from '@playwright/test'

test('toggles dark mode and persists the choice across a reload', async ({
  page,
}) => {
  await page.goto('/')

  const root = page.locator('html')
  await expect(root).not.toHaveClass(/dark/)

  await page.locator('#more-toggle-btn').click()
  await page.locator('#theme-toggle-btn').click()

  await expect(root).toHaveClass(/dark/)
  await expect(page.locator('#theme-toggle-btn')).toHaveAttribute(
    'aria-checked',
    'true',
  )
  expect(await page.evaluate(() => localStorage.getItem('creator-ui-theme'))).toBe(
    'dark',
  )

  await page.reload()
  await expect(root).toHaveClass(/dark/)
})

test('restores dark mode before paint when it is already stored', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem('creator-ui-theme', 'dark')
  })

  await page.goto('/')

  await expect(page.locator('html')).toHaveClass(/dark/)
})
