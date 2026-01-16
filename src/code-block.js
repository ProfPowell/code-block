/**
 * Code Block Web Component with Syntax Highlighting and Copy Button
 * Uses highlight.js for syntax highlighting (limited language bundle)
 */

// Import highlight.js core and specific languages only
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // HTML/XML
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import php from 'highlight.js/lib/languages/php'
import http from 'highlight.js/lib/languages/http'
import plaintext from 'highlight.js/lib/languages/plaintext'
import diff from 'highlight.js/lib/languages/diff'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('xhtml', xml)
hljs.registerLanguage('svg', xml)
hljs.registerLanguage('markup', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('yml', yaml)
hljs.registerLanguage('php', php)
hljs.registerLanguage('http', http)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('text', plaintext)
hljs.registerLanguage('txt', plaintext)
hljs.registerLanguage('csv', plaintext)
hljs.registerLanguage('diff', diff)

export class CodeBlock extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._codeContent = null
    this._showShareMenu = false
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
    this._observer = null
    this._highlighted = false
  }

  connectedCallback() {
    // Capture the original text content before rendering
    this._codeContent = this.textContent

    // Use lazy loading if attribute is set
    if (this.hasAttribute('lazy')) {
      this.renderPlaceholder()
      this._setupLazyObserver()
    } else {
      this.render()
    }
  }

  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect()
      this._observer = null
    }
    document.removeEventListener('click', this._handleOutsideClick)
  }

  /**
   * Set up IntersectionObserver for lazy highlighting
   */
  _setupLazyObserver() {
    if (this._observer) return

    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._highlighted) {
          this._highlighted = true
          this.render()
          this._observer.disconnect()
          this._observer = null
        }
      },
      { rootMargin: '100px' } // Start loading slightly before visible
    )

    this._observer.observe(this)
  }

  static get observedAttributes() {
    return [
      'language',
      'label',
      'theme',
      'show-lines',
      'filename',
      'highlight-lines',
      'collapsed',
      'max-lines',
      'max-height',
      'wrap',
      'copy-text',
      'copied-text',
      'show-share',
      'show-download',
      'no-copy',
      'lazy'
    ]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      this.render()
    }
  }

  get language() {
    return this.getAttribute('language') || 'plaintext'
  }

  get label() {
    return this.getAttribute('label') || this.filename || this.language.toUpperCase()
  }

  get theme() {
    return this.getAttribute('theme') || 'light'
  }

  get showLines() {
    return this.hasAttribute('show-lines')
  }

  get filename() {
    return this.getAttribute('filename') || ''
  }

  get highlightLines() {
    const attr = this.getAttribute('highlight-lines')
    if (!attr) return new Set()

    const lines = new Set()
    const parts = attr.split(',')

    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        for (let i = start; i <= end; i++) {
          lines.add(i)
        }
      } else {
        lines.add(Number(trimmed))
      }
    }

    return lines
  }

  get collapsed() {
    return this.hasAttribute('collapsed')
  }

  get maxLines() {
    const attr = this.getAttribute('max-lines')
    return attr ? parseInt(attr, 10) : 10
  }

  get maxHeight() {
    return this.getAttribute('max-height') || ''
  }

  get wrap() {
    return this.hasAttribute('wrap')
  }

  get copyText() {
    return this.getAttribute('copy-text') || 'Copy'
  }

  get copiedText() {
    return this.getAttribute('copied-text') || 'Copied!'
  }

  get showShare() {
    return this.hasAttribute('show-share')
  }

  get showDownload() {
    return this.hasAttribute('show-download')
  }

  get noCopy() {
    return this.hasAttribute('no-copy')
  }

  get lazy() {
    return this.hasAttribute('lazy')
  }

  async copyCode() {
    const rawCode = (this._codeContent || this.textContent).trim()

    // Unescape HTML entities
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = rawCode
    const unescapedCode = tempDiv.textContent

    const button = this.shadowRoot.querySelector('.copy-button')
    const originalText = this.copyText
    const successText = this.copiedText

    try {
      await navigator.clipboard.writeText(unescapedCode)
      button.textContent = successText
      button.classList.add('copied')
      button.setAttribute('aria-label', 'Code copied to clipboard')
    } catch (err) {
      console.error('Failed to copy code:', err)
      button.textContent = 'Failed'
      button.classList.add('failed')
      button.setAttribute('aria-label', 'Failed to copy code')
    }

    setTimeout(() => {
      button.textContent = originalText
      button.classList.remove('copied', 'failed')
      button.setAttribute('aria-label', 'Copy code to clipboard')
    }, 2000)
  }

  /**
   * Download code as a file
   */
  downloadCode() {
    const code = this.getCode()
    const filename = this.filename || `code.${this._getFileExtension()}`

    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Get file extension based on language
   */
  _getFileExtension() {
    const extensions = {
      javascript: 'js',
      js: 'js',
      typescript: 'ts',
      ts: 'ts',
      html: 'html',
      markup: 'html',
      css: 'css',
      json: 'json',
      yaml: 'yml',
      yml: 'yml',
      php: 'php',
      xml: 'xml',
      xhtml: 'xhtml',
      svg: 'svg',
      http: 'http',
      diff: 'diff',
      csv: 'csv',
      plaintext: 'txt',
      text: 'txt',
      txt: 'txt'
    }
    return extensions[this.language] || 'txt'
  }

  /**
   * Toggle share menu visibility
   */
  toggleShareMenu() {
    this._showShareMenu = !this._showShareMenu
    const menu = this.shadowRoot.querySelector('.share-menu')
    const shareBtn = this.shadowRoot.querySelector('.share-button')

    if (this._showShareMenu) {
      menu.style.display = 'block'
      shareBtn.classList.add('active')
      setTimeout(() => {
        document.addEventListener('click', this._handleOutsideClick)
      }, 0)
    } else {
      menu.style.display = 'none'
      shareBtn.classList.remove('active')
      document.removeEventListener('click', this._handleOutsideClick)
    }
  }

  _handleOutsideClick(e) {
    const menu = this.shadowRoot.querySelector('.share-menu')
    if (menu && !menu.contains(e.target)) {
      this.toggleShareMenu()
    }
  }

  /**
   * Share via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return

    const code = this.getCode()
    const title = this.filename || this.label

    try {
      await navigator.share({
        title: title,
        text: code
      })
      this.toggleShareMenu()
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
    }
  }

  /**
   * Open code in CodePen
   */
  openInCodePen() {
    const code = this.getCode()
    const lang = this.language

    let data = {
      title: this.filename || this.label || 'Code Block Demo',
      description: 'Code shared from code-block component',
      editors: '111'
    }

    // Assign code to the appropriate CodePen field based on language
    if (['html', 'markup', 'xhtml', 'xml', 'svg'].includes(lang)) {
      data.html = code
      data.editors = '100'
    } else if (lang === 'css') {
      data.css = code
      data.editors = '010'
    } else if (['javascript', 'js'].includes(lang)) {
      data.js = code
      data.editors = '001'
    } else {
      // For other languages, put in HTML as preformatted
      data.html = `<pre><code>${this.escapeHtml(code)}</code></pre>`
      data.editors = '100'
    }

    // Create form and submit to CodePen
    const form = document.createElement('form')
    form.action = 'https://codepen.io/pen/define'
    form.method = 'POST'
    form.target = '_blank'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'data'
    input.value = JSON.stringify(data)

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)

    this.toggleShareMenu()
  }

  getStyles() {
    const isDark = this.theme === 'dark'

    return `
      :host {
        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        background: var(--cb-bg, ${isDark ? '#0d1117' : '#f6f8fa'});
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background: var(--cb-header-bg, ${isDark ? '#161b22' : '#e1e4e8'});
        border-bottom: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#d1d5da'});
        gap: 1rem;
      }

      .label-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
        flex: 1;
      }

      .label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--cb-label-color, ${isDark ? '#8b949e' : '#586069'});
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex-shrink: 0;
      }

      .filename {
        font-size: 0.8rem;
        color: var(--cb-filename-color, ${isDark ? '#c9d1d9' : '#24292e'});
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
      }

      .copy-button {
        background: var(--cb-button-bg, ${isDark ? '#21262d' : '#fff'});
        border: 1px solid var(--cb-button-border, ${isDark ? '#30363d' : '#d1d5da'});
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--cb-button-color, ${isDark ? '#c9d1d9' : '#24292e'});
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        flex-shrink: 0;
      }

      .copy-button:hover {
        background: var(--cb-button-hover-bg, ${isDark ? '#30363d' : '#f3f4f6'});
        border-color: ${isDark ? '#8b949e' : '#959da5'};
      }

      .copy-button:focus {
        outline: 2px solid var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0366d6'});
        outline-offset: 2px;
      }

      .copy-button:active {
        transform: scale(0.98);
      }

      .copy-button.copied {
        background: var(--cb-success-color, #238636);
        color: white;
        border-color: var(--cb-success-color, #238636);
      }

      .copy-button.failed {
        background: var(--cb-error-color, #da3633);
        color: white;
        border-color: var(--cb-error-color, #da3633);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .action-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--cb-label-color, ${isDark ? '#8b949e' : '#57606a'});
        transition: all 0.15s ease;
        border-radius: 4px;
      }

      .action-button:hover {
        color: var(--cb-button-color, ${isDark ? '#c9d1d9' : '#24292e'});
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      }

      .action-button:active {
        transform: scale(0.95);
      }

      .action-button.active {
        color: var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0969da'});
        background: ${isDark ? 'rgba(56, 139, 253, 0.15)' : 'rgba(9, 105, 218, 0.1)'};
      }

      .action-button svg {
        width: 16px;
        height: 16px;
      }

      .share-container {
        position: relative;
        display: inline-block;
      }

      .share-menu {
        display: none;
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        background: var(--cb-header-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 160px;
        z-index: 1000;
        overflow: hidden;
      }

      .share-menu-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: none;
        border: none;
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
        font-size: 0.8125rem;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
        border-bottom: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .share-menu-item:last-child {
        border-bottom: none;
      }

      .share-menu-item:hover {
        background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
      }

      .share-menu-item:active {
        background: ${isDark ? 'rgba(56, 139, 253, 0.15)' : 'rgba(9, 105, 218, 0.1)'};
      }

      .share-menu-item svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      .code-container {
        display: flex;
        overflow-x: auto;
        background: var(--cb-code-bg, ${isDark ? '#0d1117' : '#fff'});
      }

      .line-numbers {
        padding: 1rem 0;
        text-align: right;
        user-select: none;
        background: var(--cb-line-numbers-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border-right: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        color: var(--cb-line-numbers-color, ${isDark ? '#484f58' : '#959da5'});
        line-height: 1.6;
        flex-shrink: 0;
      }

      .line-numbers span {
        display: block;
        padding: 0 0.75rem;
        min-width: 2.5rem;
      }

      .line-numbers span.highlighted {
        background: var(--cb-highlight-gutter, ${isDark ? 'rgba(136, 192, 208, 0.15)' : 'rgba(255, 235, 59, 0.3)'});
        color: var(--cb-line-numbers-highlight-color, ${isDark ? '#c9d1d9' : '#24292e'});
      }

      pre {
        margin: 0;
        padding: 0;
        flex: 1;
        overflow-x: auto;
      }

      code {
        display: block;
        font-family: inherit;
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
        background: transparent;
        padding: 1rem;
      }

      .code-line {
        display: block;
        line-height: 1.6;
        padding: 0 0.5rem;
        margin: 0 -0.5rem;
        white-space: pre;
      }

      .code-line.highlighted {
        background: var(--cb-highlight-bg, ${isDark ? 'rgba(136, 192, 208, 0.15)' : 'rgba(255, 235, 59, 0.3)'});
        border-left: 3px solid var(--cb-highlight-border, ${isDark ? '#58a6ff' : '#f9a825'});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      /* highlight.js theme - GitHub style with CSS custom properties */
      .hljs-comment,
      .hljs-quote {
        color: var(--cb-comment, ${isDark ? '#8b949e' : '#6a737d'});
        font-style: italic;
      }

      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-addition {
        color: var(--cb-keyword, ${isDark ? '#ff7b72' : '#d73a49'});
      }

      .hljs-number,
      .hljs-literal,
      .hljs-doctag,
      .hljs-regexp {
        color: var(--cb-number, ${isDark ? '#79c0ff' : '#005cc5'});
      }

      .hljs-string,
      .hljs-meta .hljs-meta-string {
        color: var(--cb-string, ${isDark ? '#a5d6ff' : '#22863a'});
      }

      .hljs-title,
      .hljs-section,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: var(--cb-function, ${isDark ? '#d2a8ff' : '#6f42c1'});
      }

      .hljs-attribute,
      .hljs-attr,
      .hljs-variable,
      .hljs-template-variable,
      .hljs-class .hljs-title,
      .hljs-type {
        color: var(--cb-attribute, ${isDark ? '#79c0ff' : '#005cc5'});
      }

      .hljs-symbol,
      .hljs-bullet,
      .hljs-subst,
      .hljs-meta,
      .hljs-meta .hljs-keyword,
      .hljs-selector-attr,
      .hljs-selector-pseudo,
      .hljs-link {
        color: var(--cb-meta, ${isDark ? '#ffa657' : '#e36209'});
      }

      .hljs-built_in,
      .hljs-deletion {
        color: var(--cb-builtin, ${isDark ? '#ffa198' : '#d73a49'});
      }

      .hljs-tag {
        color: var(--cb-tag, ${isDark ? '#7ee787' : '#22863a'});
      }

      .hljs-tag .hljs-name {
        color: var(--cb-tag, ${isDark ? '#7ee787' : '#22863a'});
      }

      .hljs-tag .hljs-attr {
        color: var(--cb-attribute, ${isDark ? '#79c0ff' : '#005cc5'});
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: bold;
      }

      /* Diff support - added/removed lines */
      .code-line.diff-add {
        background: var(--cb-diff-add-bg, ${isDark ? 'rgba(46, 160, 67, 0.2)' : 'rgba(46, 160, 67, 0.15)'});
        border-left: 3px solid var(--cb-diff-add-border, ${isDark ? '#3fb950' : '#22863a'});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      .code-line.diff-remove {
        background: var(--cb-diff-remove-bg, ${isDark ? 'rgba(248, 81, 73, 0.2)' : 'rgba(248, 81, 73, 0.15)'});
        border-left: 3px solid var(--cb-diff-remove-border, ${isDark ? '#f85149' : '#cb2431'});
        margin-left: calc(-0.5rem - 3px);
        padding-left: calc(0.5rem + 3px);
      }

      .line-numbers span.diff-add {
        background: var(--cb-diff-add-gutter, ${isDark ? 'rgba(46, 160, 67, 0.15)' : 'rgba(46, 160, 67, 0.1)'});
        color: var(--cb-diff-add-color, ${isDark ? '#3fb950' : '#22863a'});
      }

      .line-numbers span.diff-remove {
        background: var(--cb-diff-remove-gutter, ${isDark ? 'rgba(248, 81, 73, 0.15)' : 'rgba(248, 81, 73, 0.1)'});
        color: var(--cb-diff-remove-color, ${isDark ? '#f85149' : '#cb2431'});
      }

      .hljs-addition {
        color: var(--cb-diff-add-text, ${isDark ? '#3fb950' : '#22863a'});
        background: transparent;
      }

      .hljs-deletion {
        color: var(--cb-diff-remove-text, ${isDark ? '#f85149' : '#cb2431'});
        background: transparent;
      }

      /* Collapsible code blocks */
      :host([collapsed]) .code-container {
        position: relative;
      }

      :host([collapsed]) .code-container::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(transparent, var(--cb-code-bg, ${isDark ? '#0d1117' : '#fff'}));
        pointer-events: none;
      }

      :host([collapsed]) pre {
        overflow: hidden;
      }

      :host([collapsed]) code {
        display: block;
        overflow: hidden;
      }

      .expand-button {
        display: none;
        width: 100%;
        padding: 0.5rem 1rem;
        background: var(--cb-expand-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border: none;
        border-top: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        color: var(--cb-expand-color, ${isDark ? '#58a6ff' : '#0366d6'});
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        transition: background 0.2s;
      }

      .expand-button:hover {
        background: var(--cb-expand-hover-bg, ${isDark ? '#21262d' : '#e1e4e8'});
      }

      .expand-button:focus {
        outline: 2px solid var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0366d6'});
        outline-offset: -2px;
      }

      :host([collapsed]) .expand-button,
      :host([data-expandable]) .expand-button {
        display: block;
      }

      /* Max height with scroll */
      :host([max-height]) .code-container {
        max-height: var(--cb-max-height);
        overflow-y: auto;
      }

      :host([max-height]) .code-container::-webkit-scrollbar {
        width: 8px;
      }

      :host([max-height]) .code-container::-webkit-scrollbar-track {
        background: var(--cb-scrollbar-track, ${isDark ? '#161b22' : '#f6f8fa'});
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, ${isDark ? '#30363d' : '#d1d5da'});
        border-radius: 4px;
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb:hover {
        background: var(--cb-scrollbar-thumb-hover, ${isDark ? '#484f58' : '#959da5'});
      }

      /* Word wrap option */
      :host([wrap]) code {
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      :host([wrap]) .code-line {
        white-space: pre-wrap;
        word-break: break-word;
      }
    `
  }

  /**
   * Render a placeholder without syntax highlighting (for lazy loading)
   */
  renderPlaceholder() {
    const code = (this._codeContent || this.textContent).trim()
    const lines = code.split('\n')
    const escapedCode = this.escapeHtml(code)

    // Simple wrapped lines without highlighting
    const wrappedLines = escapedCode
      .split('\n')
      .map((line) => {
        return `<span class="code-line">${line || ' '}</span>`
      })
      .join('')

    // Generate line numbers if enabled
    const lineNumbersHtml = this.showLines
      ? `<div class="line-numbers" aria-hidden="true">${lines
          .map((_, i) => {
            return `<span>${i + 1}</span>`
          })
          .join('')}</div>`
      : ''

    // Build header content
    const labelHtml = this.filename
      ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>`
      : `<span class="label">${this.escapeHtml(this.label)}</span>`

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${labelHtml}
        </div>
        <div class="header-actions">
          <button class="copy-button" aria-label="${this.copyText}">${this.copyText}</button>
        </div>
      </div>
      <div class="code-wrapper">
        <div class="code-container">
          ${lineNumbersHtml}
          <pre><code class="hljs">${wrappedLines}</code></pre>
        </div>
      </div>
    `

    // Add copy button listener
    const copyButton = this.shadowRoot.querySelector('.copy-button')
    if (copyButton) {
      copyButton.addEventListener('click', () => this.copyCode())
    }
  }

  render() {
    const code = (this._codeContent || this.textContent).trim()
    const rawLines = code.split('\n')
    const highlightedLines = this.highlightLines
    const isDiff = this.language === 'diff'

    // Apply syntax highlighting
    let highlightedCode
    try {
      if (
        this.language &&
        this.language !== 'plaintext' &&
        this.language !== 'text' &&
        this.language !== 'txt'
      ) {
        const result = hljs.highlight(code, { language: this.language, ignoreIllegals: true })
        highlightedCode = result.value
      } else {
        highlightedCode = this.escapeHtml(code)
      }
    } catch {
      // Fallback if language not supported
      highlightedCode = this.escapeHtml(code)
    }

    // Split into lines and wrap each line for highlighting
    const lines = highlightedCode.split('\n')
    const wrappedLines = lines
      .map((line, i) => {
        const lineNum = i + 1
        const isHighlighted = highlightedLines.has(lineNum)
        const classes = ['code-line']

        if (isHighlighted) classes.push('highlighted')

        // Detect diff lines from raw code
        if (isDiff) {
          const rawLine = rawLines[i] || ''
          if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) {
            classes.push('diff-add')
          } else if (rawLine.startsWith('-') && !rawLine.startsWith('---')) {
            classes.push('diff-remove')
          }
        }

        return `<span class="${classes.join(' ')}">${line || ' '}</span>`
      })
      .join('')

    // Generate line numbers if enabled
    const lineNumbersHtml = this.showLines
      ? `<div class="line-numbers" aria-hidden="true">${lines
          .map((_, i) => {
            const lineNum = i + 1
            const isHighlighted = highlightedLines.has(lineNum)
            const classes = []

            if (isHighlighted) classes.push('highlighted')

            // Add diff classes to line numbers too
            if (isDiff) {
              const rawLine = rawLines[i] || ''
              if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) {
                classes.push('diff-add')
              } else if (rawLine.startsWith('-') && !rawLine.startsWith('---')) {
                classes.push('diff-remove')
              }
            }

            return `<span class="${classes.join(' ')}">${lineNum}</span>`
          })
          .join('')}</div>`
      : ''

    // Build header content
    const labelHtml = this.filename
      ? `<span class="label">${this.escapeHtml(this.language.toUpperCase())}</span><span class="filename">${this.escapeHtml(this.filename)}</span>`
      : `<span class="label">${this.escapeHtml(this.label)}</span>`

    // Calculate collapsed height based on max-lines
    const isCollapsible = this.hasAttribute('collapsed') || this.hasAttribute('max-lines')
    const totalLines = lines.length
    const maxLines = this.maxLines
    const needsExpand = isCollapsible && totalLines > maxLines
    const isCurrentlyCollapsed = this.collapsed

    // Calculate line height for collapsed state (approx 1.6 * font-size)
    const collapsedHeight = isCurrentlyCollapsed ? `calc(${maxLines} * 1.6em + 2rem)` : 'none'

    // Set max-height CSS variable if provided
    const maxHeightStyle = this.maxHeight ? `--cb-max-height: ${this.maxHeight};` : ''

    // Set collapsed height
    const codeStyle = isCurrentlyCollapsed ? `max-height: ${collapsedHeight};` : ''

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="label-container" id="code-label">
          ${labelHtml}
        </div>
        <div class="header-actions">
          ${
            this.showShare
              ? `
            <div class="share-container">
              <button class="action-button share-button" title="Share code">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 12V3M8 3L5 6M8 3l3 3"/>
                  <path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9"/>
                </svg>
              </button>
              <div class="share-menu">
                ${
                  typeof navigator !== 'undefined' && navigator.share
                    ? `
                  <button class="share-menu-item share-native">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="4" r="2"/>
                      <circle cx="4" cy="8" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M6 9l4 2M6 7l4-2"/>
                    </svg>
                    Share...
                  </button>
                `
                    : ''
                }
                <button class="share-menu-item share-codepen">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0L0 5v6l8 5 8-5V5L8 0zM7 10.5L2 7.5v-2l5 3v2zm1-3l-5-3L8 2l5 2.5-5 3zm1 3v-2l5-3v2l-5 3z"/>
                  </svg>
                  Open in CodePen
                </button>
              </div>
            </div>
          `
              : ''
          }
          ${
            this.showDownload
              ? `
            <button class="action-button download-button" title="Download code">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 1v10M8 11l-3-3M8 11l3-3"/>
                <path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2"/>
              </svg>
            </button>
          `
              : ''
          }
          ${
            !this.noCopy
              ? `<button class="copy-button"
                  aria-label="Copy code to clipboard"
                  title="Copy code">${this.escapeHtml(this.copyText)}</button>`
              : ''
          }
        </div>
      </div>
      <div class="code-container" role="region" aria-labelledby="code-label" style="${maxHeightStyle}${codeStyle}">
        ${lineNumbersHtml}
        <pre><code class="language-${this.language}" tabindex="0">${wrappedLines}</code></pre>
      </div>
      ${
        needsExpand
          ? `
        <button class="expand-button" aria-expanded="${!isCurrentlyCollapsed}">
          ${isCurrentlyCollapsed ? `Show all ${totalLines} lines` : 'Show less'}
        </button>
      `
          : ''
      }
    `

    // Mark as expandable for CSS
    if (needsExpand) {
      this.setAttribute('data-expandable', '')
    } else {
      this.removeAttribute('data-expandable')
    }

    // Add copy button event listener
    const copyBtn = this.shadowRoot.querySelector('.copy-button')
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode())
    }

    // Add expand button event listener
    const expandBtn = this.shadowRoot.querySelector('.expand-button')
    if (expandBtn) {
      expandBtn.addEventListener('click', () => this.toggleCollapsed())
    }

    // Add share button event listeners
    const shareBtn = this.shadowRoot.querySelector('.share-button')
    if (shareBtn) {
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.toggleShareMenu()
      })
    }

    const shareNative = this.shadowRoot.querySelector('.share-native')
    if (shareNative) {
      shareNative.addEventListener('click', () => this.shareViaWebAPI())
    }

    const shareCodepen = this.shadowRoot.querySelector('.share-codepen')
    if (shareCodepen) {
      shareCodepen.addEventListener('click', () => this.openInCodePen())
    }

    // Add download button event listener
    const downloadBtn = this.shadowRoot.querySelector('.download-button')
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadCode())
    }
  }

  toggleCollapsed() {
    if (this.collapsed) {
      this.removeAttribute('collapsed')
    } else {
      this.setAttribute('collapsed', '')
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Update the code content programmatically
   */
  setCode(code) {
    this._codeContent = code
    this.render()
  }

  /**
   * Get the current code content
   */
  getCode() {
    return (this._codeContent || this.textContent).trim()
  }

  /**
   * Get list of supported languages
   */
  static getSupportedLanguages() {
    return hljs.listLanguages()
  }
}

customElements.define('code-block', CodeBlock)

/**
 * Code Block Group - Tabbed interface for multiple code blocks
 */
class CodeBlockGroup extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._activeIndex = 0
    this._showShareMenu = false
    this._handleOutsideClick = this._handleOutsideClick.bind(this)
  }

  connectedCallback() {
    // Wait for children to be parsed
    requestAnimationFrame(() => {
      this.render()
      this.setupEventListeners()
    })
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._handleOutsideClick)
  }

  static get observedAttributes() {
    return ['theme', 'show-share', 'show-download']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      this.render()
    }
  }

  get theme() {
    return this.getAttribute('theme') || 'light'
  }

  get showShare() {
    return this.hasAttribute('show-share')
  }

  get showDownload() {
    return this.hasAttribute('show-download')
  }

  get codeBlocks() {
    return Array.from(this.querySelectorAll('code-block'))
  }

  get activeIndex() {
    return this._activeIndex
  }

  set activeIndex(value) {
    const blocks = this.codeBlocks
    if (value >= 0 && value < blocks.length) {
      this._activeIndex = value
      this.updateActiveTab()
    }
  }

  getStyles() {
    const isDark = this.theme === 'dark'

    return `
      :host {
        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        background: var(--cb-bg, ${isDark ? '#0d1117' : '#f6f8fa'});
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .tabs {
        display: flex;
        background: var(--cb-header-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border-bottom: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tabs::-webkit-scrollbar {
        height: 4px;
      }

      .tabs::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, ${isDark ? '#30363d' : '#d1d5da'});
        border-radius: 2px;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--cb-label-color, ${isDark ? '#8b949e' : '#57606a'});
        font-family: inherit;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
      }

      .tab:hover {
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
        background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
      }

      .tab:focus-visible {
        outline: 2px solid var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0969da'});
        outline-offset: -2px;
      }

      .tab[aria-selected="true"] {
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
        border-bottom-color: var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0969da'});
        background: var(--cb-code-bg, ${isDark ? '#0d1117' : '#fff'});
      }

      .language-badge {
        display: inline-block;
        padding: 0.125rem 0.375rem;
        background: ${isDark ? 'rgba(110, 118, 129, 0.4)' : 'rgba(175, 184, 193, 0.4)'};
        border-radius: 4px;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }

      .content {
        position: relative;
      }

      ::slotted(code-block) {
        display: none !important;
        margin: 0 !important;
        border: none !important;
        border-radius: 0 !important;
      }

      ::slotted(code-block.active) {
        display: block !important;
      }

      /* Header with tabs and actions */
      .header {
        display: flex;
        align-items: stretch;
        background: var(--cb-header-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border-bottom: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
      }

      .tabs {
        border-bottom: none;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-left: auto;
        padding: 0 0.5rem;
      }

      .action-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 4px;
        color: var(--cb-label-color, ${isDark ? '#8b949e' : '#57606a'});
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .action-button:hover {
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
      }

      .action-button:focus-visible {
        outline: 2px solid var(--cb-focus-color, ${isDark ? '#58a6ff' : '#0969da'});
        outline-offset: 1px;
      }

      .action-button svg {
        width: 16px;
        height: 16px;
      }

      .share-container {
        position: relative;
      }

      .share-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        min-width: 140px;
        padding: 0.25rem 0;
        background: var(--cb-bg, ${isDark ? '#21262d' : '#fff'});
        border: 1px solid var(--cb-border-color, ${isDark ? '#30363d' : '#e1e4e8'});
        border-radius: 6px;
        box-shadow: 0 8px 24px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.12)'};
        z-index: 100;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-4px);
        transition: opacity 0.15s, visibility 0.15s, transform 0.15s;
      }

      .share-menu.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .share-menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: transparent;
        border: none;
        color: var(--cb-text-color, ${isDark ? '#c9d1d9' : '#24292e'});
        font-family: inherit;
        font-size: 0.8125rem;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s;
      }

      .share-menu-item:hover {
        background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
      }

      .share-menu-item svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
    `
  }

  render() {
    const blocks = this.codeBlocks
    if (blocks.length === 0) return

    // Propagate theme to child code-blocks
    blocks.forEach((block, index) => {
      block.setAttribute('theme', this.theme)
      if (index === this._activeIndex) {
        block.classList.add('active')
      } else {
        block.classList.remove('active')
      }
    })

    const tabs = blocks
      .map((block, index) => {
        const filename = block.getAttribute('filename')
        const label = block.getAttribute('label')
        const language = block.getAttribute('language') || 'plaintext'
        const displayName = filename || label || language.toUpperCase()
        const isActive = index === this._activeIndex

        return `
        <button
          class="tab"
          role="tab"
          aria-selected="${isActive}"
          aria-controls="panel-${index}"
          tabindex="${isActive ? '0' : '-1'}"
          data-index="${index}"
        >
          <span class="tab-label">${this.escapeHtml(displayName)}</span>
          ${filename ? `<span class="language-badge">${language}</span>` : ''}
        </button>
      `
      })
      .join('')

    const hasActions = this.showShare || this.showDownload
    const actionsHtml = hasActions
      ? `
      <div class="header-actions">
        ${
          this.showDownload
            ? `
          <button class="action-button download-button" aria-label="Download code" title="Download">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"/>
              <path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"/>
            </svg>
          </button>
        `
            : ''
        }
        ${
          this.showShare
            ? `
          <div class="share-container">
            <button class="action-button share-button" aria-label="Share code" title="Share" aria-haspopup="true" aria-expanded="${this._showShareMenu}">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a3.005 3.005 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Zm-9-5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
              </svg>
            </button>
            <div class="share-menu ${this._showShareMenu ? 'open' : ''}" role="menu">
              ${
                typeof navigator !== 'undefined' && navigator.share
                  ? `
                <button class="share-menu-item web-share-button" role="menuitem">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.5 3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15 3a3 3 0 0 1-5.175 2.066l-3.92 2.179a3.005 3.005 0 0 1 0 1.51l3.92 2.179a3 3 0 1 1-.73 1.31l-3.92-2.178a3 3 0 1 1 0-4.133l3.92-2.178A3 3 0 1 1 15 3Zm-1.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Zm-9-5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"/>
                  </svg>
                  Share...
                </button>
              `
                  : ''
              }
              <button class="share-menu-item codepen-button" role="menuitem">
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0L0 5.333v5.334L8 16l8-5.333V5.333L8 0zm5.714 9.703L8 13.297l-5.714-3.594V6.297L8 2.703l5.714 3.594v3.406z"/>
                  <path d="M8 4.703L4.286 7.5 8 10.297 11.714 7.5 8 4.703z"/>
                </svg>
                Open in CodePen
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>
    `
      : ''

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="header">
        <div class="tabs" role="tablist" aria-label="Code files">
          ${tabs}
        </div>
        ${actionsHtml}
      </div>
      <div class="content">
        <slot></slot>
      </div>
    `
  }

  setupEventListeners() {
    const tabList = this.shadowRoot.querySelector('.tabs')
    if (!tabList) return

    // Click handler for tabs
    tabList.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab')
      if (tab) {
        const index = parseInt(tab.dataset.index, 10)
        this.activeIndex = index
      }
    })

    // Keyboard navigation
    tabList.addEventListener('keydown', (e) => {
      const tabs = this.shadowRoot.querySelectorAll('.tab')
      const currentIndex = this._activeIndex
      let newIndex = currentIndex

      switch (e.key) {
        case 'ArrowLeft':
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
          break
        case 'ArrowRight':
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
          break
        case 'Home':
          newIndex = 0
          break
        case 'End':
          newIndex = tabs.length - 1
          break
        default:
          return
      }

      e.preventDefault()
      this.activeIndex = newIndex
      tabs[newIndex].focus()
    })

    // Action button handlers
    const downloadBtn = this.shadowRoot.querySelector('.download-button')
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadCode())
    }

    const shareBtn = this.shadowRoot.querySelector('.share-button')
    if (shareBtn) {
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        this.toggleShareMenu()
      })
    }

    const webShareBtn = this.shadowRoot.querySelector('.web-share-button')
    if (webShareBtn) {
      webShareBtn.addEventListener('click', () => {
        this.shareViaWebAPI()
        this.toggleShareMenu()
      })
    }

    const codepenBtn = this.shadowRoot.querySelector('.codepen-button')
    if (codepenBtn) {
      codepenBtn.addEventListener('click', () => {
        this.openInCodePen()
        this.toggleShareMenu()
      })
    }
  }

  updateActiveTab() {
    const tabs = this.shadowRoot.querySelectorAll('.tab')
    const blocks = this.codeBlocks

    tabs.forEach((tab, index) => {
      const isActive = index === this._activeIndex
      tab.setAttribute('aria-selected', isActive)
      tab.setAttribute('tabindex', isActive ? '0' : '-1')
    })

    blocks.forEach((block, index) => {
      if (index === this._activeIndex) {
        block.classList.add('active')
      } else {
        block.classList.remove('active')
      }
    })

    // Dispatch event for external listeners
    this.dispatchEvent(
      new CustomEvent('tab-change', {
        detail: { index: this._activeIndex, block: blocks[this._activeIndex] },
        bubbles: true
      })
    )
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * Programmatically select a tab by index
   */
  selectTab(index) {
    this.activeIndex = index
  }

  /**
   * Get the currently active code block
   */
  getActiveBlock() {
    return this.codeBlocks[this._activeIndex]
  }

  /**
   * Toggle share menu visibility
   */
  toggleShareMenu() {
    this._showShareMenu = !this._showShareMenu
    const menu = this.shadowRoot.querySelector('.share-menu')
    const button = this.shadowRoot.querySelector('.share-button')
    if (menu) {
      menu.classList.toggle('open', this._showShareMenu)
    }
    if (button) {
      button.setAttribute('aria-expanded', this._showShareMenu)
    }

    if (this._showShareMenu) {
      document.addEventListener('click', this._handleOutsideClick)
    } else {
      document.removeEventListener('click', this._handleOutsideClick)
    }
  }

  /**
   * Handle clicks outside share menu
   */
  _handleOutsideClick(e) {
    const shareContainer = this.shadowRoot.querySelector('.share-container')
    if (shareContainer && !e.composedPath().includes(shareContainer)) {
      this._showShareMenu = false
      const menu = this.shadowRoot.querySelector('.share-menu')
      const button = this.shadowRoot.querySelector('.share-button')
      if (menu) menu.classList.remove('open')
      if (button) button.setAttribute('aria-expanded', 'false')
      document.removeEventListener('click', this._handleOutsideClick)
    }
  }

  /**
   * Download code from the active block
   */
  downloadCode() {
    const block = this.getActiveBlock()
    if (block && typeof block.downloadCode === 'function') {
      block.downloadCode()
    }
  }

  /**
   * Open all blocks' code in CodePen (aggregates HTML, CSS, JS)
   */
  openInCodePen() {
    const blocks = this.codeBlocks
    if (blocks.length === 0) return

    let html = ''
    let css = ''
    let js = ''
    let title = 'Code Block Group'

    // Aggregate code from all blocks by language
    blocks.forEach((block) => {
      const lang = block.language
      const code = block.getCode()
      const filename = block.filename

      if (['html', 'markup', 'xhtml', 'xml', 'svg'].includes(lang)) {
        if (html) html += '\n\n'
        if (filename) html += `<!-- ${filename} -->\n`
        html += code
      } else if (lang === 'css') {
        if (css) css += '\n\n'
        if (filename) css += `/* ${filename} */\n`
        css += code
      } else if (['javascript', 'js'].includes(lang)) {
        if (js) js += '\n\n'
        if (filename) js += `// ${filename}\n`
        js += code
      }

      // Use first filename as title if available
      if (!title || title === 'Code Block Group') {
        title = filename || block.label || 'Code Block Group'
      }
    })

    // Determine which editors to show
    let editors = ''
    editors += html ? '1' : '0'
    editors += css ? '1' : '0'
    editors += js ? '1' : '0'

    const data = {
      title: title,
      description: 'Code shared from code-block-group component',
      html: html,
      css: css,
      js: js,
      editors: editors
    }

    const form = document.createElement('form')
    form.action = 'https://codepen.io/pen/define'
    form.method = 'POST'
    form.target = '_blank'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'data'
    input.value = JSON.stringify(data)

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  /**
   * Share all blocks' code via Web Share API
   */
  async shareViaWebAPI() {
    if (!navigator.share) return

    const blocks = this.codeBlocks
    if (blocks.length === 0) return

    // Combine all code with filename headers
    let combinedCode = ''
    blocks.forEach((block) => {
      const filename = block.filename || block.label || block.language
      const code = block.getCode()
      if (combinedCode) combinedCode += '\n\n'
      combinedCode += `// === ${filename} ===\n${code}`
    })

    try {
      await navigator.share({
        title: 'Code from code-block-group',
        text: combinedCode
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err)
      }
    }
  }
}

customElements.define('code-block-group', CodeBlockGroup)

export { CodeBlockGroup }
