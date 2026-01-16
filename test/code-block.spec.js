import { test, expect } from '@playwright/test'

test.describe('code-block', () => {
  test('page loads and component exists', async ({ page }) => {
    // Navigate and don't wait for network idle
    await page.goto('/test/test-page.html')

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
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.shadowRoot !== null
    })
    expect(hasShadow).toBe(true)
  })

  test('copy button exists in shadow DOM', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const hasCopyButton = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.shadowRoot?.querySelector('.copy-button') !== null
    })
    expect(hasCopyButton).toBe(true)
  })

  test('getCode returns content', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const hasCode = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      const code = el?.getCode?.()
      return typeof code === 'string' && code.length > 0
    })
    expect(hasCode).toBe(true)
  })

  test('language attribute is set', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const language = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.getAttribute('language')
    })
    expect(language).toBeTruthy()
  })

  test('no-copy attribute hides copy button', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#no-copy-block')
      if (!el) return { found: false }
      const copyButton = el.shadowRoot?.querySelector('.copy-button')
      return {
        found: true,
        hasNoCopyAttr: el.hasAttribute('no-copy'),
        copyButtonExists: copyButton !== null
      }
    })

    expect(result.found).toBe(true)
    expect(result.hasNoCopyAttr).toBe(true)
    expect(result.copyButtonExists).toBe(false)
  })

  test('show-download attribute shows download button', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForTimeout(2000)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#download-block')
      if (!el) return { found: false }
      const downloadButton = el.shadowRoot?.querySelector('.download-button')
      return {
        found: true,
        hasShowDownloadAttr: el.hasAttribute('show-download'),
        downloadButtonExists: downloadButton !== null
      }
    })

    expect(result.found).toBe(true)
    expect(result.hasShowDownloadAttr).toBe(true)
    expect(result.downloadButtonExists).toBe(true)
  })
})
