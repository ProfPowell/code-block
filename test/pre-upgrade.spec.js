/**
 * What readers see before (or without) the component script.
 *
 * Every test here aborts the module request. A script that loads cannot catch
 * these bugs: once it runs, :not(:defined) stops matching.
 */
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { prerenderCodeBlock } from '../ssr/index.js'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

async function openBlocked(page, body) {
  await page.route('**/cb-module.js', (route) => route.abort())
  await page.route('**/__pre-upgrade', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>pre-upgrade</title>
        <link rel="stylesheet" href="/code-block.css">
        <script type="module" src="/cb-module.js"></script></head><body>${body}</body></html>`
    })
  )
  await page.goto('/__pre-upgrade')
}

test.describe('pre-upgrade stylesheet', () => {
  test('plain blocks are readable code when the script never loads', async ({ page }) => {
    await openBlocked(
      page,
      `<code-block id="a" language="javascript">const a = 1;
const b = 2;
const c = 3;</code-block>`
    )
    const el = page.locator('#a')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('display', 'block')
    await expect(el).toHaveCSS('opacity', '1')
    await expect(el).toHaveCSS('white-space', 'pre')
    await expect(el).toHaveCSS('font-family', /monospace/)
    expect((await el.boundingBox()).height).toBeGreaterThan(60)
  })

  test('keeps its height at upgrade', async ({ page }) => {
    const body = `<code-block id="a" language="javascript" label="x">const a = 1;
const b = 2;
const c = 3;</code-block>`
    await openBlocked(page, body)
    const before = (await page.locator('#a').boundingBox()).height
    await page.addScriptTag({ type: 'module', url: '/src/code-block.js' })
    await page.waitForFunction(() => customElements.get('code-block'))
    await expect(page.locator('#a .copy-button')).toBeVisible()
    const after = (await page.locator('#a').boundingBox()).height
    expect(Math.abs(after - before)).toBeLessThan(4)
  })

  test('honours component tokens so the first paint matches the theme', async ({ page }) => {
    await openBlocked(
      page,
      `<code-block id="a" style="--cb-font-family: serif; --cb-code-bg: rgb(1, 2, 3); --cb-text-color: rgb(4, 5, 6)">x</code-block>`
    )
    const el = page.locator('#a')
    await expect(el).toHaveCSS('font-family', 'serif')
    await expect(el).toHaveCSS('background-color', 'rgb(1, 2, 3)')
    await expect(el).toHaveCSS('color', 'rgb(4, 5, 6)')
  })

  test('textarea content source reads as code, not a form control', async ({ page }) => {
    await openBlocked(
      page,
      `<code-block id="a">
        <textarea>line one
line two
line three</textarea>
      </code-block>`
    )
    const host = page.locator('#a')
    const area = page.locator('#a textarea')
    await expect(area).toBeVisible()
    await expect(area).toHaveCSS('border-top-style', 'none')
    await expect(area).toHaveCSS('font-family', /monospace/)
    // Fills the block, and the whitespace around it adds no blank lines:
    // the only extra height is padding, border and the header's reserved room.
    const [h, a] = [await host.boundingBox(), await area.boundingBox()]
    expect(a.width).toBeGreaterThan(h.width * 0.8)
    expect(h.height - a.height).toBeLessThan(90)
  })

  test('group whitespace does not become blank lines', async ({ page }) => {
    await openBlocked(
      page,
      `<code-block-group id="g">

        <code-block id="a">x</code-block>

        <code-block id="b">y</code-block>

      </code-block-group>`
    )
    const group = page.locator('#g')
    await expect(group).toHaveCSS('display', 'block')
    await expect(group).toHaveCSS('white-space', 'normal')
    const [a, b] = [await page.locator('#a').boundingBox(), await page.locator('#b').boundingBox()]
    expect(b.y - (a.y + a.height)).toBeLessThan(40)
  })

  test('leaves server-rendered blocks to their shadow styles', async ({ page }) => {
    const ssr = prerenderCodeBlock({ code: 'const x = 1;', language: 'javascript' })
    await openBlocked(page, ssr)
    const el = page.locator('code-block')
    // A page rule beats :host, so any match here would leak into the shadow tree.
    await expect(el).toHaveCSS('white-space', 'normal')
    await expect(el).toHaveCSS('overflow-x', 'hidden')
    await expect(el.locator('.hljs-keyword').first()).toBeVisible()
  })
})

test.describe('packaging', () => {
  test('the stylesheet is exported and published', () => {
    expect(pkg.exports['./code-block.css']).toBe('./code-block.css')
    expect(pkg.files).toContain('code-block.css')
  })
})

test.describe('script behaviour', () => {
  test('does not inject an anti-flash rule', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForFunction(() => customElements.get('code-block'))
    const injected = await page.evaluate(() =>
      [...document.querySelectorAll('style')].filter((s) => s.textContent.includes(':defined')).length
    )
    expect(injected).toBe(0)
  })
})

test.describe('scoped data-mode', () => {
  const render = (page, body) =>
    page.evaluate((html) => {
      document.body.insertAdjacentHTML('beforeend', html)
    }, body)

  test.beforeEach(async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForFunction(() => customElements.get('code-block'))
  })

  test('a dark region on a light page renders dark', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-mode', 'light'))
    await render(page, `<aside data-mode="dark"><code-block id="s">x</code-block></aside>`)
    await expect(page.locator('#s')).toHaveAttribute('data-page-theme', 'dark')
  })

  test('a light region on a dark page renders light', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-mode', 'dark'))
    await render(page, `<aside data-mode="light"><code-block id="s">x</code-block></aside>`)
    await expect(page.locator('#s')).toHaveAttribute('data-page-theme', 'light')
  })

  test('the nearest region wins, and groups follow it too', async ({ page }) => {
    await render(
      page,
      `<div data-mode="light"><div data-mode="dark">
        <code-block-group id="g"><code-block id="s" label="a">x</code-block></code-block-group>
      </div></div>`
    )
    await expect(page.locator('#g')).toHaveAttribute('data-page-theme', 'dark')
    // The group hands its theme to its children as an attribute.
    await expect(page.locator('#s')).toHaveAttribute('theme', 'dark')
  })

  test('tracks the region attribute changing and being removed', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-mode', 'light'))
    await render(page, `<aside id="r" data-mode="dark"><code-block id="s">x</code-block></aside>`)
    const el = page.locator('#s')
    await expect(el).toHaveAttribute('data-page-theme', 'dark')
    await page.evaluate(() => document.querySelector('#r').setAttribute('data-mode', 'light'))
    await expect(el).toHaveAttribute('data-page-theme', 'light')
    await page.evaluate(() => document.querySelector('#r').setAttribute('data-mode', 'dark'))
    await expect(el).toHaveAttribute('data-page-theme', 'dark')
    await page.evaluate(() => document.querySelector('#r').removeAttribute('data-mode'))
    await expect(el).toHaveAttribute('data-page-theme', 'light')
  })

  test('a region added around an existing block is picked up', async ({ page }) => {
    await page.evaluate(() => document.documentElement.setAttribute('data-mode', 'light'))
    await render(page, `<aside id="r"><code-block id="s">x</code-block></aside>`)
    await expect(page.locator('#s')).toHaveAttribute('data-page-theme', 'light')
    await page.evaluate(() => document.querySelector('#r').setAttribute('data-mode', 'dark'))
    await expect(page.locator('#s')).toHaveAttribute('data-page-theme', 'dark')
  })

  test('an explicit theme attribute still wins', async ({ page }) => {
    await render(page, `<aside data-mode="dark"><code-block id="s" theme="light">x</code-block></aside>`)
    await expect(page.locator('#s')).not.toHaveAttribute('data-page-theme', /.*/)
    expect(await page.locator('#s').evaluate((n) => n.theme)).toBe('light')
  })
})

test.describe('--cb-button-hover-color', () => {
  test('sets the copy button text on hover', async ({ page }) => {
    await page.goto('/test/test-page.html')
    await page.waitForFunction(() => customElements.get('code-block'))
    await page.evaluate(() => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<code-block id="h" style="--cb-button-hover-color: rgb(1, 2, 3)">x</code-block>`
      )
    })
    const button = page.locator('#h .copy-button')
    await button.hover()
    await expect(button).toHaveCSS('color', 'rgb(1, 2, 3)')
  })

  test('is mirrored in SSR styles', () => {
    expect(prerenderCodeBlock({ code: 'x', language: 'text' })).toContain('--cb-button-hover-color')
  })
})
