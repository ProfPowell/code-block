/**
 * SSR Module Unit Tests
 * Run with: node --test test/ssr.test.js
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { prerenderCodeBlock, prerenderCodeBlocksInHtml } from '../ssr/index.js'

describe('prerenderCodeBlock', () => {
  it('produces valid HTML with data-ssr attribute', () => {
    const html = prerenderCodeBlock({ code: 'const x = 1;', language: 'javascript' })
    assert.ok(html.includes('data-ssr'))
    assert.ok(html.startsWith('<code-block'))
    assert.ok(html.endsWith('</code-block>'))
  })

  it('includes Declarative Shadow DOM template', () => {
    const html = prerenderCodeBlock({ code: 'x = 1', language: 'python' })
    assert.ok(html.includes('<template shadowrootmode="open">'))
    assert.ok(html.includes('</template>'))
  })

  it('applies syntax highlighting with hljs classes', () => {
    const html = prerenderCodeBlock({ code: 'const x = 42;', language: 'javascript' })
    assert.ok(html.includes('hljs-keyword'))
    assert.ok(html.includes('hljs-number'))
  })

  it('preserves raw code in textarea for copy/getCode', () => {
    const code = 'const x = 42;'
    const html = prerenderCodeBlock({ code, language: 'javascript' })
    assert.ok(html.includes('<textarea'))
    assert.ok(html.includes('const x = 42;'))
  })

  it('generates line numbers when showLines is true', () => {
    const html = prerenderCodeBlock({
      code: 'line1\nline2\nline3',
      language: 'plaintext',
      showLines: true,
    })
    assert.ok(html.includes('class="line-numbers"'))
    assert.ok(html.includes('>1</span>'))
    assert.ok(html.includes('>2</span>'))
    assert.ok(html.includes('>3</span>'))
  })

  it('highlights specified lines', () => {
    const html = prerenderCodeBlock({
      code: 'a\nb\nc\nd',
      language: 'plaintext',
      highlightLines: '2,4',
    })
    // Line 2 and 4 should have highlighted class
    const codeLines = html.match(/<span class="[^"]*code-line[^"]*">/g)
    assert.ok(codeLines[1].includes('highlighted'))
    assert.ok(codeLines[3].includes('highlighted'))
    // Line 1 and 3 should not
    assert.ok(!codeLines[0].includes('highlighted'))
    assert.ok(!codeLines[2].includes('highlighted'))
  })

  it('handles highlight-lines range syntax', () => {
    const html = prerenderCodeBlock({
      code: 'a\nb\nc\nd\ne',
      language: 'plaintext',
      highlightLines: '2-4',
    })
    const codeLines = html.match(/<span class="[^"]*code-line[^"]*">/g)
    assert.ok(!codeLines[0].includes('highlighted'))
    assert.ok(codeLines[1].includes('highlighted'))
    assert.ok(codeLines[2].includes('highlighted'))
    assert.ok(codeLines[3].includes('highlighted'))
    assert.ok(!codeLines[4].includes('highlighted'))
  })

  it('handles diff language with add/remove classes', () => {
    const html = prerenderCodeBlock({
      code: '  unchanged\n+ added\n- removed\n  unchanged',
      language: 'diff',
    })
    assert.ok(html.includes('diff-add'))
    assert.ok(html.includes('diff-remove'))
  })

  it('respects dark theme', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext', theme: 'dark' })
    assert.ok(html.includes('theme="dark"'))
    assert.ok(html.includes('#0d1117'))
  })

  it('includes filename in header when provided', () => {
    const html = prerenderCodeBlock({
      code: 'test',
      language: 'javascript',
      filename: 'app.js',
    })
    assert.ok(html.includes('filename="app.js"'))
    assert.ok(html.includes('class="filename"'))
    assert.ok(html.includes('app.js'))
  })

  it('hides copy button when noCopy is true', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext', noCopy: true })
    // No copy button element in the header-actions area (CSS still references the class for styling)
    assert.ok(!html.includes('<button class="copy-button"'))
    assert.ok(html.includes('no-copy'))
  })

  it('includes share button when showShare is true', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext', showShare: true })
    assert.ok(html.includes('share-button'))
    assert.ok(html.includes('share-codepen'))
  })

  it('includes download button when showDownload is true', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext', showDownload: true })
    assert.ok(html.includes('download-button'))
  })

  it('includes expand button for collapsed blocks', () => {
    const code = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join('\n')
    const html = prerenderCodeBlock({
      code,
      language: 'plaintext',
      collapsed: true,
      maxLines: 5,
    })
    assert.ok(html.includes('expand-button'))
    assert.ok(html.includes('Show all 20 lines'))
    assert.ok(html.includes('collapsed'))
    assert.ok(html.includes('data-expandable'))
  })

  it('includes wrap attribute', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext', wrap: true })
    assert.ok(html.includes(' wrap'))
  })

  it('escapes HTML entities in code', () => {
    const html = prerenderCodeBlock({ code: '<div class="test">', language: 'html' })
    // The textarea should have escaped content
    assert.ok(html.includes('&lt;div'))
  })

  it('handles plaintext without hljs classes in code output', () => {
    const html = prerenderCodeBlock({ code: 'just plain text', language: 'plaintext' })
    // The code area itself should not contain hljs spans (CSS references are fine)
    const codeMatch = html.match(/<code class="language-plaintext"[^>]*>([\s\S]*?)<\/code>/)
    assert.ok(codeMatch)
    assert.ok(!codeMatch[1].includes('hljs-keyword'))
    assert.ok(html.includes('just plain text'))
  })

  it('handles unknown language gracefully', () => {
    const html = prerenderCodeBlock({ code: 'some code', language: 'nonexistent' })
    assert.ok(html.includes('some code'))
    assert.ok(html.includes('data-ssr'))
  })

  it('includes CSS styles in shadow DOM', () => {
    const html = prerenderCodeBlock({ code: 'x', language: 'plaintext' })
    assert.ok(html.includes('<style>'))
    assert.ok(html.includes(':host'))
    assert.ok(html.includes('.copy-button'))
  })

  it('uses custom copy text', () => {
    const html = prerenderCodeBlock({
      code: 'x',
      language: 'plaintext',
      copyText: 'Copy Code',
    })
    assert.ok(html.includes('Copy Code'))
    assert.ok(html.includes('copy-text="Copy Code"'))
  })
})

describe('prerenderCodeBlocksInHtml', () => {
  it('processes code-block elements in HTML', () => {
    const input = '<div><code-block language="javascript">const x = 1;</code-block></div>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.ok(output.includes('data-ssr'))
    assert.ok(output.includes('shadowrootmode'))
    assert.ok(output.includes('<div>'))
  })

  it('preserves surrounding HTML', () => {
    const input = '<h1>Title</h1><code-block language="css">body { color: red; }</code-block><p>After</p>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.ok(output.includes('<h1>Title</h1>'))
    assert.ok(output.includes('<p>After</p>'))
  })

  it('handles textarea content source', () => {
    const input = '<code-block language="javascript"><textarea>const x = 1;</textarea></code-block>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.ok(output.includes('data-ssr'))
    assert.ok(output.includes('hljs-keyword'))
  })

  it('skips blocks with data-ssr', () => {
    const input = '<code-block language="javascript" data-ssr>already done</code-block>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.strictEqual(output, input)
  })

  it('skips blocks with src attribute', () => {
    const input = '<code-block language="javascript" src="/code.js"></code-block>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.strictEqual(output, input)
  })

  it('handles multiple code blocks', () => {
    const input = `
      <code-block language="javascript">const a = 1;</code-block>
      <code-block language="python">x = 1</code-block>
    `
    const output = prerenderCodeBlocksInHtml(input)
    const ssrCount = (output.match(/data-ssr/g) || []).length
    assert.strictEqual(ssrCount, 2)
  })

  it('preserves attributes from original element', () => {
    const input = '<code-block language="javascript" show-lines highlight-lines="2" theme="dark"><textarea>a\nb\nc</textarea></code-block>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.ok(output.includes('show-lines'))
    assert.ok(output.includes('highlight-lines="2"'))
    assert.ok(output.includes('theme="dark"'))
  })

  it('handles HTML entities in content', () => {
    const input = '<code-block language="html">&lt;div&gt;test&lt;/div&gt;</code-block>'
    const output = prerenderCodeBlocksInHtml(input)
    assert.ok(output.includes('data-ssr'))
  })
})
