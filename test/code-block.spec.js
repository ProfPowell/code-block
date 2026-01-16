import { test, expect } from '@playwright/test'

test.describe('code-block', () => {
  test('page loads and component exists', async ({ page }) => {
    // Navigate and don't wait for network idle
    await page.goto('/demo/index.html')

    // Log the current URL
    console.log('Current URL:', page.url())

    // Wait a bit for JS to execute
    await page.waitForTimeout(2000)

    // Check if we have any code-block elements
    const count = await page.locator('code-block').count()
    console.log('code-block count:', count)

    expect(count).toBeGreaterThan(0)
  })

  test('component has shadow DOM', async ({ page }) => {
    await page.goto('/demo/index.html')
    await page.waitForTimeout(2000)

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.shadowRoot !== null
    })
    expect(hasShadow).toBe(true)
  })

  test('copy button exists in shadow DOM', async ({ page }) => {
    await page.goto('/demo/index.html')
    await page.waitForTimeout(2000)

    const hasCopyButton = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.shadowRoot?.querySelector('.copy-button') !== null
    })
    expect(hasCopyButton).toBe(true)
  })

  test('getCode returns content', async ({ page }) => {
    await page.goto('/demo/index.html')
    await page.waitForTimeout(2000)

    const hasCode = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      const code = el?.getCode?.()
      return typeof code === 'string' && code.length > 0
    })
    expect(hasCode).toBe(true)
  })

  test('language attribute is set', async ({ page }) => {
    await page.goto('/demo/index.html')
    await page.waitForTimeout(2000)

    const language = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.getAttribute('language')
    })
    expect(language).toBeTruthy()
  })
})
