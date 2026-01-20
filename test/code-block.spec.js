import { test, expect } from '@playwright/test'

const TEST_URL = '/test/test-page.html'
const LOAD_TIMEOUT = 2000

// Helper to wait for component to be ready
async function waitForComponent(page) {
  await page.waitForTimeout(LOAD_TIMEOUT)
}

test.describe('code-block - Basic Functionality', () => {
  test('page loads and component exists', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const count = await page.locator('code-block').count()
    expect(count).toBeGreaterThan(0)
  })

  test('component has shadow DOM', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasShadow = await page.evaluate(() => {
      const el = document.querySelector('code-block')
      return el?.shadowRoot !== null
    })
    expect(hasShadow).toBe(true)
  })

  test('copy button exists in shadow DOM', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasCopyButton = await page.evaluate(() => {
      const el = document.querySelector('#basic-block')
      return el?.shadowRoot?.querySelector('.copy-button') !== null
    })
    expect(hasCopyButton).toBe(true)
  })

  test('getCode returns content', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const code = await page.evaluate(() => {
      const el = document.querySelector('#basic-block')
      return el?.getCode?.()
    })
    expect(code).toContain('Hello, World!')
  })

  test('setCode updates content', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const newCode = await page.evaluate(() => {
      const el = document.querySelector('#basic-block')
      el?.setCode?.('const updated = true;')
      return el?.getCode?.()
    })
    expect(newCode).toContain('updated')
  })

  test('language attribute is set and reflected', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const language = await page.evaluate(() => {
      const el = document.querySelector('#basic-block')
      return el?.language
    })
    expect(language).toBe('javascript')
  })

  test('filename attribute shows in header', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasFilename = await page.evaluate(() => {
      const el = document.querySelector('#basic-block')
      const header = el?.shadowRoot?.querySelector('.header')
      return header?.textContent?.includes('test.js')
    })
    expect(hasFilename).toBe(true)
  })
})

test.describe('code-block - Line Numbers', () => {
  test('show-lines attribute displays line numbers', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasLineNumbers = await page.evaluate(() => {
      const el = document.querySelector('#line-numbers-block')
      const lineNumbers = el?.shadowRoot?.querySelector('.line-numbers')
      return lineNumbers !== null
    })
    expect(hasLineNumbers).toBe(true)
  })

  test('line numbers match line count', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#line-numbers-block')
      const lineNumbers = el?.shadowRoot?.querySelectorAll('.line-numbers span')
      const codeLines = el?.shadowRoot?.querySelectorAll('.code-line')
      return {
        lineNumberCount: lineNumbers?.length || 0,
        codeLineCount: codeLines?.length || 0
      }
    })
    expect(result.lineNumberCount).toBe(result.codeLineCount)
  })
})

test.describe('code-block - Line Highlighting', () => {
  test('highlight-lines attribute highlights specified lines', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#highlight-block')
      const highlightedLines = el?.shadowRoot?.querySelectorAll('.code-line.highlighted')
      return {
        hasHighlightAttr: el?.hasAttribute('highlight-lines'),
        highlightedCount: highlightedLines?.length || 0
      }
    })
    expect(result.hasHighlightAttr).toBe(true)
    expect(result.highlightedCount).toBe(2) // Lines 2 and 4
  })

  test('highlighted lines have correct class', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#highlight-block')
      const allLines = el?.shadowRoot?.querySelectorAll('.code-line')
      // Lines 2 and 4 should be highlighted (0-indexed: 1 and 3)
      return {
        line2Highlighted: allLines?.[1]?.classList?.contains('highlighted'),
        line4Highlighted: allLines?.[3]?.classList?.contains('highlighted'),
        line1NotHighlighted: !allLines?.[0]?.classList?.contains('highlighted'),
        line3NotHighlighted: !allLines?.[2]?.classList?.contains('highlighted')
      }
    })
    expect(result.line2Highlighted).toBe(true)
    expect(result.line4Highlighted).toBe(true)
    expect(result.line1NotHighlighted).toBe(true)
    expect(result.line3NotHighlighted).toBe(true)
  })
})

test.describe('code-block - Focus Mode', () => {
  test('focus-mode attribute is recognized', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasFocusMode = await page.evaluate(() => {
      const el = document.querySelector('#focus-mode-block')
      return el?.hasAttribute('focus-mode') && el?.focusMode === true
    })
    expect(hasFocusMode).toBe(true)
  })

  test('focus-mode applies host attribute for CSS styling', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#focus-mode-block')
      // Check that the element has focus-mode attribute (used by :host([focus-mode]) selector)
      return {
        hasFocusModeAttr: el?.hasAttribute('focus-mode'),
        hasHighlightLines: el?.hasAttribute('highlight-lines')
      }
    })
    expect(result.hasFocusModeAttr).toBe(true)
    expect(result.hasHighlightLines).toBe(true)
  })

  test('focus-mode has highlighted and non-highlighted lines', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#focus-mode-block')
      const allLines = el?.shadowRoot?.querySelectorAll('.code-line')
      const highlightedLines = el?.shadowRoot?.querySelectorAll('.code-line.highlighted')
      return {
        totalLines: allLines?.length || 0,
        highlightedCount: highlightedLines?.length || 0
      }
    })
    expect(result.highlightedCount).toBe(2) // Lines 2-3
    expect(result.totalLines).toBeGreaterThan(result.highlightedCount)
  })
})

test.describe('code-block - Theme Support', () => {
  test('dark theme is applied', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const theme = await page.evaluate(() => {
      const el = document.querySelector('#dark-theme-block')
      return el?.theme
    })
    expect(theme).toBe('dark')
  })

  test('light theme is applied', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const theme = await page.evaluate(() => {
      const el = document.querySelector('#light-theme-block')
      return el?.theme
    })
    expect(theme).toBe('light')
  })

  test('dark theme has different styles than light', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const darkEl = document.querySelector('#dark-theme-block')
      const lightEl = document.querySelector('#light-theme-block')
      const darkContainer = darkEl?.shadowRoot?.querySelector('.code-container')
      const lightContainer = lightEl?.shadowRoot?.querySelector('.code-container')
      const darkBg = darkContainer ? getComputedStyle(darkContainer).backgroundColor : null
      const lightBg = lightContainer ? getComputedStyle(lightContainer).backgroundColor : null
      return {
        darkBg,
        lightBg,
        different: darkBg !== lightBg
      }
    })
    expect(result.different).toBe(true)
  })
})

test.describe('code-block - Collapsible', () => {
  test('collapsed attribute hides overflow lines', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#collapsed-block')
      const expandButton = el?.shadowRoot?.querySelector('.expand-button')
      return {
        isCollapsed: el?.collapsed,
        hasExpandButton: expandButton !== null
      }
    })
    expect(result.isCollapsed).toBe(true)
    expect(result.hasExpandButton).toBe(true)
  })

  test('max-lines attribute is respected', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const maxLines = await page.evaluate(() => {
      const el = document.querySelector('#collapsed-block')
      return el?.maxLines
    })
    expect(maxLines).toBe(3)
  })

  test('toggleCollapsed expands the code', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#collapsed-block')
      const wasCollapsed = el?.collapsed
      el?.toggleCollapsed?.()
      const isNowCollapsed = el?.collapsed
      return { wasCollapsed, isNowCollapsed }
    })
    expect(result.wasCollapsed).toBe(true)
    expect(result.isNowCollapsed).toBe(false)
  })
})

test.describe('code-block - Max Height', () => {
  test('max-height attribute is applied', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const maxHeight = await page.evaluate(() => {
      const el = document.querySelector('#max-height-block')
      return el?.maxHeight
    })
    expect(maxHeight).toBe('100px')
  })

  test('max-height creates scrollable container', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const isScrollable = await page.evaluate(() => {
      const el = document.querySelector('#max-height-block')
      const codeContainer = el?.shadowRoot?.querySelector('.code-container')
      const styles = codeContainer ? getComputedStyle(codeContainer) : null
      return styles?.overflowY === 'auto' || styles?.overflowY === 'scroll'
    })
    expect(isScrollable).toBe(true)
  })
})

test.describe('code-block - Wrap', () => {
  test('wrap attribute is applied', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const hasWrap = await page.evaluate(() => {
      const el = document.querySelector('#wrap-block')
      return el?.wrap
    })
    expect(hasWrap).toBe(true)
  })
})

test.describe('code-block - Custom Copy Text', () => {
  test('custom copy-text is displayed', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const copyText = await page.evaluate(() => {
      const el = document.querySelector('#custom-copy-text-block')
      const copyButton = el?.shadowRoot?.querySelector('.copy-button')
      return copyButton?.textContent?.trim()
    })
    expect(copyText).toBe('Clone')
  })

  test('custom copied-text is set', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const copiedText = await page.evaluate(() => {
      const el = document.querySelector('#custom-copy-text-block')
      return el?.copiedText
    })
    expect(copiedText).toBe('Cloned!')
  })
})

test.describe('code-block - Label', () => {
  test('custom label is displayed', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const label = await page.evaluate(() => {
      const el = document.querySelector('#label-block')
      return el?.label
    })
    expect(label).toBe('Custom Label')
  })

  test('label appears in header', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const headerHasLabel = await page.evaluate(() => {
      const el = document.querySelector('#label-block')
      const header = el?.shadowRoot?.querySelector('.header')
      return header?.textContent?.includes('Custom Label')
    })
    expect(headerHasLabel).toBe(true)
  })
})

test.describe('code-block - No Copy', () => {
  test('no-copy attribute hides copy button', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#no-copy-block')
      const copyButton = el?.shadowRoot?.querySelector('.copy-button')
      return {
        hasNoCopyAttr: el?.hasAttribute('no-copy'),
        noCopy: el?.noCopy,
        copyButtonExists: copyButton !== null
      }
    })
    expect(result.hasNoCopyAttr).toBe(true)
    expect(result.noCopy).toBe(true)
    expect(result.copyButtonExists).toBe(false)
  })
})

test.describe('code-block - Download Button', () => {
  test('show-download attribute shows download button', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#download-block')
      const downloadButton = el?.shadowRoot?.querySelector('.download-button')
      return {
        hasShowDownloadAttr: el?.hasAttribute('show-download'),
        showDownload: el?.showDownload,
        downloadButtonExists: downloadButton !== null
      }
    })
    expect(result.hasShowDownloadAttr).toBe(true)
    expect(result.showDownload).toBe(true)
    expect(result.downloadButtonExists).toBe(true)
  })
})

test.describe('code-block - Share Button', () => {
  test('show-share attribute shows share button', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#share-block')
      const shareButton = el?.shadowRoot?.querySelector('.share-button')
      return {
        hasShowShareAttr: el?.hasAttribute('show-share'),
        showShare: el?.showShare,
        shareButtonExists: shareButton !== null
      }
    })
    expect(result.hasShowShareAttr).toBe(true)
    expect(result.showShare).toBe(true)
    expect(result.shareButtonExists).toBe(true)
  })
})

test.describe('code-block - Diff Support', () => {
  test('diff language is recognized', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const language = await page.evaluate(() => {
      const el = document.querySelector('#diff-block')
      return el?.language
    })
    expect(language).toBe('diff')
  })

  test('diff lines have add/remove classes', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#diff-block')
      const addLines = el?.shadowRoot?.querySelectorAll('.diff-add')
      const removeLines = el?.shadowRoot?.querySelectorAll('.diff-remove')
      return {
        addCount: addLines?.length || 0,
        removeCount: removeLines?.length || 0
      }
    })
    expect(result.addCount).toBeGreaterThan(0)
    expect(result.removeCount).toBeGreaterThan(0)
  })
})

test.describe('code-block - Multiple Languages', () => {
  test('Python syntax highlighting works', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#python-block')
      const hasHljsClasses = el?.shadowRoot?.querySelector('[class*="hljs-"]') !== null
      return {
        language: el?.language,
        hasHighlighting: hasHljsClasses
      }
    })
    expect(result.language).toBe('python')
    expect(result.hasHighlighting).toBe(true)
  })

  test('TypeScript syntax highlighting works', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#typescript-block')
      const hasHljsClasses = el?.shadowRoot?.querySelector('[class*="hljs-"]') !== null
      return {
        language: el?.language,
        hasHighlighting: hasHljsClasses
      }
    })
    expect(result.language).toBe('typescript')
    expect(result.hasHighlighting).toBe(true)
  })

  test('Bash syntax highlighting works', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#bash-block')
      const hasHljsClasses = el?.shadowRoot?.querySelector('[class*="hljs-"]') !== null
      return {
        language: el?.language,
        hasHighlighting: hasHljsClasses
      }
    })
    expect(result.language).toBe('bash')
    expect(result.hasHighlighting).toBe(true)
  })

  test('CSS syntax highlighting works', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#css-block')
      const hasHljsClasses = el?.shadowRoot?.querySelector('[class*="hljs-"]') !== null
      return {
        language: el?.language,
        hasHighlighting: hasHljsClasses
      }
    })
    expect(result.language).toBe('css')
    expect(result.hasHighlighting).toBe(true)
  })
})

test.describe('code-block-group', () => {
  test('group component exists and has shadow DOM', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#group-block')
      return {
        exists: el !== null,
        hasShadow: el?.shadowRoot !== null
      }
    })
    expect(result.exists).toBe(true)
    expect(result.hasShadow).toBe(true)
  })

  test('group has tabs for each code block', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#group-block')
      const tabs = el?.shadowRoot?.querySelectorAll('.tab')
      const codeBlocks = el?.querySelectorAll('code-block')
      return {
        tabCount: tabs?.length || 0,
        blockCount: codeBlocks?.length || 0
      }
    })
    expect(result.tabCount).toBe(3) // app.js, styles.css, index.html
    expect(result.tabCount).toBe(result.blockCount)
  })

  test('clicking tab switches active code block', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#group-block')
      const tabs = el?.shadowRoot?.querySelectorAll('.tab')

      // Get initial active tab index
      const initialIndex = el?.activeIndex

      // Click second tab
      tabs?.[1]?.click()

      // Get new active index
      const newIndex = el?.activeIndex

      // Check aria-selected attribute
      const secondTabSelected = tabs?.[1]?.getAttribute('aria-selected') === 'true'

      return {
        initialIndex,
        newIndex,
        secondTabSelected,
        changed: initialIndex !== newIndex
      }
    })
    expect(result.changed).toBe(true)
    expect(result.newIndex).toBe(1)
    expect(result.secondTabSelected).toBe(true)
  })

  test('group theme propagates to children', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#group-dark-block')
      const groupTheme = el?.theme
      const childBlocks = el?.querySelectorAll('code-block')
      const childThemes = Array.from(childBlocks || []).map(block => block.theme)
      return {
        groupTheme,
        childThemes,
        allMatch: childThemes.every(t => t === groupTheme)
      }
    })
    expect(result.groupTheme).toBe('dark')
    expect(result.allMatch).toBe(true)
  })
})

test.describe('code-block - Static Methods', () => {
  test('getSupportedLanguages returns array of languages', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const languages = await page.evaluate(() => {
      const CodeBlock = customElements.get('code-block')
      return CodeBlock?.getSupportedLanguages?.() || []
    })
    expect(Array.isArray(languages)).toBe(true)
    expect(languages.length).toBeGreaterThan(0)
    expect(languages).toContain('javascript')
    expect(languages).toContain('python')
    expect(languages).toContain('typescript')
    expect(languages).toContain('bash')
  })
})

test.describe('code-block - External File Loading (src attribute)', () => {
  test('src attribute is recognized', async ({ page }) => {
    await page.goto(TEST_URL)
    await waitForComponent(page)

    const src = await page.evaluate(() => {
      const el = document.querySelector('#external-src-block')
      return el?.src
    })
    expect(src).toBe('fixtures/sample.js')
  })

  test('external file content is loaded', async ({ page }) => {
    await page.goto(TEST_URL)
    // Wait longer for fetch to complete
    await page.waitForTimeout(3000)

    const result = await page.evaluate(() => {
      const el = document.querySelector('#external-src-block')
      const code = el?.getCode?.()
      return {
        hasContent: code?.length > 0,
        containsFunction: code?.includes('function greet')
      }
    })
    expect(result.hasContent).toBe(true)
    expect(result.containsFunction).toBe(true)
  })

  test('language is auto-detected from file extension', async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForTimeout(3000)

    const language = await page.evaluate(() => {
      const el = document.querySelector('#external-src-block')
      return el?.language
    })
    expect(language).toBe('javascript')
  })

  test('filename is auto-set from URL', async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForTimeout(3000)

    const filename = await page.evaluate(() => {
      const el = document.querySelector('#external-src-block')
      return el?.filename
    })
    expect(filename).toBe('sample.js')
  })

  test('explicit language attribute overrides auto-detection', async ({ page }) => {
    await page.goto(TEST_URL)
    await page.waitForTimeout(3000)

    const language = await page.evaluate(() => {
      const el = document.querySelector('#external-src-lang-block')
      return el?.language
    })
    expect(language).toBe('typescript')
  })

  test('code-loaded event is dispatched on success', async ({ page }) => {
    await page.goto(TEST_URL)

    // Create a new element and listen for the event
    const eventFired = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const el = document.createElement('code-block')
        el.setAttribute('src', 'fixtures/sample.js')

        el.addEventListener('code-loaded', (e) => {
          resolve({
            fired: true,
            hasUrl: !!e.detail.url,
            hasCode: !!e.detail.code
          })
        })

        el.addEventListener('code-load-error', () => {
          resolve({ fired: false, error: true })
        })

        document.body.appendChild(el)

        // Timeout fallback
        setTimeout(() => resolve({ fired: false, timeout: true }), 5000)
      })
    })

    expect(eventFired.fired).toBe(true)
    expect(eventFired.hasUrl).toBe(true)
    expect(eventFired.hasCode).toBe(true)
  })

  test('error state is shown for invalid URL', async ({ page }) => {
    await page.goto(TEST_URL)

    const result = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const el = document.createElement('code-block')
        el.setAttribute('src', 'nonexistent-file.js')

        el.addEventListener('code-load-error', (e) => {
          const shadow = el.shadowRoot
          const hasErrorLabel = shadow?.querySelector('.label')?.textContent?.includes('Error')
          resolve({
            errorFired: true,
            hasErrorUrl: !!e.detail.url,
            hasErrorMessage: !!e.detail.error,
            hasErrorUI: hasErrorLabel
          })
        })

        document.body.appendChild(el)

        // Timeout fallback
        setTimeout(() => resolve({ errorFired: false, timeout: true }), 5000)
      })
    })

    expect(result.errorFired).toBe(true)
    expect(result.hasErrorUrl).toBe(true)
    expect(result.hasErrorMessage).toBe(true)
  })
})