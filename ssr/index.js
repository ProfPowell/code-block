/**
 * SSR / Build-Time Rendering for code-block Web Component
 *
 * Pre-renders <code-block> elements with Declarative Shadow DOM
 * so highlighted code is visible before JavaScript loads.
 *
 * Usage:
 *   import { prerenderCodeBlock, prerenderCodeBlocksInHtml } from '@profpowell/code-block/ssr'
 *
 *   // Single block
 *   const html = prerenderCodeBlock({ code: 'const x = 1;', language: 'javascript' })
 *
 *   // Process an entire HTML page
 *   const page = prerenderCodeBlocksInHtml(rawHtml)
 */

// --- highlight.js setup (mirrors src/code-block.js lines 6-47) ---
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import php from 'highlight.js/lib/languages/php'
import http from 'highlight.js/lib/languages/http'
import plaintext from 'highlight.js/lib/languages/plaintext'
import diff from 'highlight.js/lib/languages/diff'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'

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
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('zsh', bash)
hljs.registerLanguage('python', python)
hljs.registerLanguage('py', python)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)


// --- Helpers ---

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseHighlightLines(attr) {
  if (!attr) return new Set()
  const lines = new Set()
  for (const part of attr.split(',')) {
    const trimmed = part.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number)
      for (let i = start; i <= end; i++) lines.add(i)
    } else {
      lines.add(Number(trimmed))
    }
  }
  return lines
}

/**
 * Span-aware splitter — mirrors splitHighlightedByLine in src/code-block.js.
 * Tracks open <span> tags so multi-line constructs (template literals,
 * triple-quoted strings, multi-line comments) don't orphan child spans
 * when the result is wrapped per-line.
 */
function splitHighlightedByLine(html) {
  const re = /(<\/?span[^>]*>)|([^<]+)/g
  const lines = ['']
  const stack = []
  let m
  while ((m = re.exec(html)) !== null) {
    const tag = m[1]
    const text = m[2]
    if (tag) {
      if (tag.startsWith('</')) stack.pop()
      else stack.push(tag)
      lines[lines.length - 1] += tag
    } else {
      const parts = text.split('\n')
      for (let i = 0; i < parts.length; i++) {
        if (i > 0) {
          lines[lines.length - 1] += '</span>'.repeat(stack.length)
          lines.push(stack.join(''))
        }
        lines[lines.length - 1] += parts[i]
      }
    }
  }
  return lines
}


// --- CSS generation (mirrors src/code-block.js getStyles()) ---

function getStyles(isDark) {
  return `
      :host {
        --_cb-bg: ${isDark ? 'var(--color-surface-raised, #0d1117)' : 'var(--color-surface-raised, #f6f8fa)'};
        --_cb-code-bg: ${isDark ? 'var(--color-surface, #0d1117)' : 'var(--color-surface, #fff)'};
        --_cb-header-bg: ${isDark ? 'var(--color-surface-raised, #161b22)' : 'var(--color-surface-raised, #e1e4e8)'};
        --_cb-text-color: ${isDark ? 'var(--color-text, #c9d1d9)' : 'var(--color-text, #24292e)'};
        --_cb-border-color: ${isDark ? 'var(--color-border, #30363d)' : 'var(--color-border, #e1e4e8)'};
        --_cb-comment: ${isDark ? 'var(--color-text-muted, #8b949e)' : 'var(--color-text-muted, #6a737d)'};
        --_cb-button-bg: ${isDark ? '#21262d' : '#fff'};
        --_cb-button-color: ${isDark ? 'var(--color-text, #c9d1d9)' : 'var(--color-text, #24292e)'};
        --_cb-scrollbar-track: ${isDark ? '#161b22' : '#f6f8fa'};
        --_cb-scrollbar-thumb: ${isDark ? '#30363d' : '#d1d5da'};

        display: block;
        margin: var(--cb-margin, 1rem 0);
        border-radius: var(--cb-border-radius, 8px);
        overflow: hidden;
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        background: var(--cb-bg, var(--_cb-bg));
        font-family: var(--cb-font-family, 'Consolas', 'Monaco', 'Courier New', monospace);
        font-size: var(--cb-font-size, 0.875rem);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--cb-header-padding, 0.5rem 1rem);
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
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
        background: var(--cb-button-bg, var(--_cb-button-bg));
        border-width: var(--cb-button-border-width, 1px);
        border-style: var(--cb-button-border-style, solid);
        border-color: var(--cb-button-border, ${isDark ? '#30363d' : '#d1d5da'});
        border-radius: var(--cb-button-radius, 4px);
        padding: var(--cb-button-padding, 4px 12px);
        font-size: var(--cb-button-font-size, 0.75rem);
        font-weight: 500;
        color: var(--cb-button-color, var(--_cb-button-color));
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
        flex-shrink: 0;
      }

      .copy-button:hover {
        background: var(--cb-button-hover-bg, ${isDark ? '#30363d' : '#f3f4f6'});
        border-color: var(--cb-button-hover-border, ${isDark ? '#8b949e' : '#959da5'});
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
        border-radius: var(--cb-button-radius, 4px);
      }

      .action-button:hover {
        color: var(--cb-button-color, var(--_cb-button-color));
        background: var(--cb-action-button-hover-bg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'});
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
        background: var(--cb-header-bg, var(--_cb-header-bg));
        border: 1px solid var(--cb-border-color, var(--_cb-border-color));
        border-radius: var(--cb-menu-radius, 8px);
        box-shadow: var(--cb-shadow, 0 4px 12px rgba(0, 0, 0, 0.15));
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
        color: var(--cb-text-color, var(--_cb-text-color));
        font-size: 0.8125rem;
        font-weight: 500;
        text-align: left;
        cursor: pointer;
        transition: background 0.15s ease;
        border-bottom: 1px solid var(--cb-border-color, var(--_cb-border-color));
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
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
        background: var(--cb-code-bg, var(--_cb-code-bg));
      }

      .line-numbers {
        padding: var(--cb-code-padding, 1rem) 0;
        text-align: right;
        user-select: none;
        background: var(--cb-line-numbers-bg, ${isDark ? '#161b22' : '#f6f8fa'});
        border-right: 1px solid var(--cb-border-color, var(--_cb-border-color));
        color: var(--cb-line-numbers-color, ${isDark ? '#484f58' : '#959da5'});
        line-height: var(--cb-line-height, 1.6);
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
        color: var(--cb-text-color, var(--_cb-text-color));
        background: transparent;
        padding: var(--cb-code-padding, 1rem);
      }

      .code-line {
        display: block;
        line-height: var(--cb-line-height, 1.6);
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

      :host([focus-mode]) .code-line:not(.highlighted) {
        opacity: var(--cb-focus-dim-opacity, 0.4);
        filter: blur(var(--cb-focus-blur, 0.5px));
        transition: opacity 0.2s ease, filter 0.2s ease;
      }

      :host([focus-mode]) .code-line.highlighted {
        opacity: 1;
        filter: none;
      }

      :host([focus-mode]) .line-numbers span:not(.highlighted) {
        opacity: var(--cb-focus-dim-opacity, 0.4);
      }

      .hljs-comment,
      .hljs-quote {
        color: var(--cb-comment, var(--_cb-comment));
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
        background: linear-gradient(transparent, var(--cb-code-bg, var(--_cb-code-bg)));
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
        border-top: 1px solid var(--cb-border-color, var(--_cb-border-color));
        color: var(--cb-expand-color, ${isDark ? '#58a6ff' : '#0366d6'});
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        font-family: var(--cb-ui-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif);
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

      :host([max-height]) .code-container {
        max-height: var(--cb-max-height);
        overflow-y: auto;
      }

      :host([max-height]) .code-container::-webkit-scrollbar {
        width: 8px;
      }

      :host([max-height]) .code-container::-webkit-scrollbar-track {
        background: var(--cb-scrollbar-track, var(--_cb-scrollbar-track));
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb {
        background: var(--cb-scrollbar-thumb, var(--_cb-scrollbar-thumb));
        border-radius: var(--cb-button-radius, 4px);
      }

      :host([max-height]) .code-container::-webkit-scrollbar-thumb:hover {
        background: var(--cb-scrollbar-thumb-hover, ${isDark ? '#484f58' : '#959da5'});
      }

      :host([wrap]) code {
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: break-word;
      }

      :host([wrap]) .code-line {
        white-space: pre-wrap;
        word-break: break-word;
      }

      :host([no-copy]) code {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      :host([no-copy]) .code-line {
        user-select: none;
        -webkit-user-select: none;
      }
    `
}


// --- SVG icons (mirrors src/code-block.js render()) ---

const ICON_SHARE = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12V3M8 3L5 6M8 3l3 3"/><path d="M3 9v4a1 1 0 001 1h8a1 1 0 001-1V9"/></svg>`

const ICON_CODEPEN = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0L0 5v6l8 5 8-5V5L8 0zM7 10.5L2 7.5v-2l5 3v2zm1-3l-5-3L8 2l5 2.5-5 3zm1 3v-2l5-3v2l-5 3z"/></svg>`

const ICON_DOWNLOAD = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1v10M8 11l-3-3M8 11l3-3"/><path d="M2 12v2a1 1 0 001 1h10a1 1 0 001-1v-2"/></svg>`


// --- Core rendering ---

/**
 * Pre-render a single code-block with Declarative Shadow DOM.
 *
 * @param {object} options
 * @param {string} options.code - Source code to highlight
 * @param {string} [options.language='plaintext'] - Language for syntax highlighting
 * @param {string} [options.theme='light'] - 'light' or 'dark'
 * @param {string} [options.filename] - Filename shown in header
 * @param {string} [options.label] - Custom label (defaults to language name)
 * @param {boolean} [options.showLines=false] - Show line numbers
 * @param {number} [options.startLine=1] - Starting line number (line numbers shown begin here)
 * @param {number} [options.endLine] - End line number (slices content to [startLine..endLine])
 * @param {string} [options.highlightLines] - Lines to highlight, e.g. "2,4-6"
 * @param {boolean} [options.focusMode=false] - Dim non-highlighted lines
 * @param {boolean} [options.collapsed=false] - Start collapsed
 * @param {number} [options.maxLines=10] - Visible lines when collapsed
 * @param {string} [options.maxHeight] - Max height with scrolling, e.g. "300px"
 * @param {boolean} [options.wrap=false] - Word wrap long lines
 * @param {boolean} [options.noCopy=false] - Hide copy button
 * @param {string} [options.copyText='Copy'] - Copy button text
 * @param {boolean} [options.showShare=false] - Show share button
 * @param {boolean} [options.showDownload=false] - Show download button
 * @returns {string} Complete <code-block data-ssr> HTML with DSD
 */
export function prerenderCodeBlock(options) {
  const {
    code,
    language = 'plaintext',
    theme = 'light',
    filename = '',
    label,
    showLines = false,
    startLine: startLineRaw,
    endLine: endLineRaw,
    highlightLines: highlightLinesAttr,
    focusMode = false,
    collapsed = false,
    maxLines = 10,
    maxHeight = '',
    wrap = false,
    noCopy = false,
    copyText = 'Copy',
    showShare = false,
    showDownload = false,
  } = options

  const isDark = theme === 'dark'
  const trimmedCode = code.trim()
  const allRawLines = trimmedCode.split('\n')
  const highlightedLineSet = parseHighlightLines(highlightLinesAttr)
  const isDiff = language === 'diff'

  const startLine =
    Number.isFinite(startLineRaw) && startLineRaw >= 1 ? Math.floor(startLineRaw) : 1
  const endLine =
    Number.isFinite(endLineRaw) && endLineRaw >= startLine ? Math.floor(endLineRaw) : null
  const count = endLine
    ? Math.min(allRawLines.length, endLine - startLine + 1)
    : allRawLines.length

  // --- Syntax highlighting ---
  // Highlight the full source so multi-line constructs keep context; span-
  // aware split handles spans straddling newlines, then slice for display.
  let highlightedCode
  try {
    if (language && language !== 'plaintext' && language !== 'text' && language !== 'txt') {
      highlightedCode = hljs.highlight(trimmedCode, { language, ignoreIllegals: true }).value
    } else {
      highlightedCode = escapeHtml(trimmedCode)
    }
  } catch {
    highlightedCode = escapeHtml(trimmedCode)
  }

  const allLines = splitHighlightedByLine(highlightedCode)
  const lines = allLines.slice(0, count)
  const rawLines = allRawLines.slice(0, count)

  // --- Wrap lines ---
  const wrappedLines = lines
    .map((line, i) => {
      const lineNum = startLine + i
      const classes = ['code-line']
      if (highlightedLineSet.has(lineNum)) classes.push('highlighted')
      if (isDiff) {
        const rawLine = rawLines[i] || ''
        if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) classes.push('diff-add')
        else if (rawLine.startsWith('-') && !rawLine.startsWith('---')) classes.push('diff-remove')
      }
      return `<span class="${classes.join(' ')}">${line || ' '}</span>`
    })
    .join('')

  // --- Line numbers ---
  const lineNumbersHtml = showLines
    ? `<div class="line-numbers" aria-hidden="true">${lines
        .map((_, i) => {
          const lineNum = startLine + i
          const classes = []
          if (highlightedLineSet.has(lineNum)) classes.push('highlighted')
          if (isDiff) {
            const rawLine = rawLines[i] || ''
            if (rawLine.startsWith('+') && !rawLine.startsWith('+++')) classes.push('diff-add')
            else if (rawLine.startsWith('-') && !rawLine.startsWith('---')) classes.push('diff-remove')
          }
          return `<span class="${classes.join(' ')}">${lineNum}</span>`
        })
        .join('')}</div>`
    : ''

  // --- Header ---
  const displayLabel = label || (filename ? language.toUpperCase() : language.toUpperCase())
  const labelHtml = filename
    ? `<span class="label">${escapeHtml(language.toUpperCase())}</span><span class="filename">${escapeHtml(filename)}</span>`
    : `<span class="label">${escapeHtml(displayLabel)}</span>`

  // --- Share button (no Web Share API in SSR — only CodePen) ---
  const shareHtml = showShare
    ? `<div class="share-container">
        <button class="action-button share-button" title="Share code">${ICON_SHARE}</button>
        <div class="share-menu">
          <button class="share-menu-item share-codepen">${ICON_CODEPEN} Open in CodePen</button>
        </div>
      </div>`
    : ''

  const downloadHtml = showDownload
    ? `<button class="action-button download-button" title="Download code">${ICON_DOWNLOAD}</button>`
    : ''

  const copyHtml = !noCopy
    ? `<button class="copy-button" aria-label="Copy code to clipboard" title="Copy code">${escapeHtml(copyText)}</button>`
    : ''

  // --- Collapsed / expand ---
  const totalLines = lines.length
  const isCollapsible = collapsed || options.maxLines !== undefined
  const needsExpand = isCollapsible && totalLines > maxLines
  const collapsedHeight = collapsed ? `calc(${maxLines} * 1.6em + 2rem)` : 'none'
  const maxHeightStyle = maxHeight ? `--cb-max-height: ${maxHeight};` : ''
  const codeStyle = collapsed ? `max-height: ${collapsedHeight};` : ''

  const expandHtml = needsExpand
    ? `<button class="expand-button" aria-expanded="${!collapsed}">${collapsed ? `Show all ${totalLines} lines` : 'Show less'}</button>`
    : ''

  // --- Shadow DOM content ---
  const shadowHtml = `<style>${getStyles(isDark)}</style>
      <div class="header">
        <div class="label-container" id="code-label">${labelHtml}</div>
        <div class="header-actions">${shareHtml}${downloadHtml}${copyHtml}</div>
      </div>
      <div class="code-container" role="region" aria-labelledby="code-label" style="${maxHeightStyle}${codeStyle}">
        ${lineNumbersHtml}
        <pre><code class="language-${language}" tabindex="0">${wrappedLines}</code></pre>
      </div>
      ${expandHtml}`

  // --- Build host attributes ---
  const attrs = [`language="${escapeHtml(language)}"`, 'data-ssr']
  if (theme !== 'light') attrs.push(`theme="${escapeHtml(theme)}"`)
  if (filename) attrs.push(`filename="${escapeHtml(filename)}"`)
  if (label) attrs.push(`label="${escapeHtml(label)}"`)
  if (showLines) attrs.push('show-lines')
  if (startLine !== 1) attrs.push(`start-line="${startLine}"`)
  if (endLine !== null) attrs.push(`end-line="${endLine}"`)
  if (highlightLinesAttr) attrs.push(`highlight-lines="${escapeHtml(highlightLinesAttr)}"`)
  if (focusMode) attrs.push('focus-mode')
  if (collapsed) attrs.push('collapsed')
  if (options.maxLines !== undefined) attrs.push(`max-lines="${maxLines}"`)
  if (maxHeight) attrs.push(`max-height="${escapeHtml(maxHeight)}"`)
  if (wrap) attrs.push('wrap')
  if (noCopy) attrs.push('no-copy')
  if (copyText !== 'Copy') attrs.push(`copy-text="${escapeHtml(copyText)}"`)
  if (showShare) attrs.push('show-share')
  if (showDownload) attrs.push('show-download')
  if (needsExpand) attrs.push('data-expandable')

  // Escape code for textarea (preserve raw content for copy/getCode)
  const textareaContent = escapeHtml(trimmedCode)

  return `<code-block ${attrs.join(' ')}><template shadowrootmode="open">${shadowHtml}</template><textarea style="display:none">${textareaContent}</textarea></code-block>`
}


/**
 * Process an HTML string, pre-rendering all <code-block> elements with DSD.
 *
 * Handles both <textarea> content and direct text content.
 * Skips blocks that already have data-ssr or use the src attribute.
 *
 * @param {string} html - Raw HTML string
 * @returns {string} HTML with code-blocks pre-rendered
 */
export function prerenderCodeBlocksInHtml(html) {
  // Match <code-block ...>...</code-block> (non-greedy, handles nested textarea)
  const pattern = /<code-block\b([^>]*)>([\s\S]*?)<\/code-block>/gi

  return html.replace(pattern, (match, attrsStr, content) => {
    // Skip already-SSR'd blocks
    if (attrsStr.includes('data-ssr')) return match
    // Skip src-loaded blocks (they load content at runtime)
    if (attrsStr.includes(' src=')) return match

    // Parse attributes
    const getAttr = (name) => {
      const re = new RegExp(`${name}="([^"]*)"`, 'i')
      const m = attrsStr.match(re)
      return m ? m[1] : null
    }
    const hasAttr = (name) => {
      return new RegExp(`\\b${name}\\b`, 'i').test(attrsStr)
    }

    // Extract code content from <textarea> or direct text
    let code
    const textareaMatch = content.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/i)
    if (textareaMatch) {
      // Decode HTML entities that may have been escaped
      code = textareaMatch[1]
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    } else {
      // Direct text content — decode entities
      code = content
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    }

    if (!code.trim()) return match

    return prerenderCodeBlock({
      code,
      language: getAttr('language') || 'plaintext',
      theme: getAttr('theme') || 'light',
      filename: getAttr('filename') || '',
      label: getAttr('label') || undefined,
      showLines: hasAttr('show-lines'),
      startLine: getAttr('start-line') !== null ? parseInt(getAttr('start-line'), 10) : undefined,
      endLine: getAttr('end-line') !== null ? parseInt(getAttr('end-line'), 10) : undefined,
      highlightLines: getAttr('highlight-lines') || undefined,
      focusMode: hasAttr('focus-mode'),
      collapsed: hasAttr('collapsed'),
      maxLines: getAttr('max-lines') !== null ? parseInt(getAttr('max-lines'), 10) : undefined,
      maxHeight: getAttr('max-height') || '',
      wrap: hasAttr('wrap'),
      noCopy: hasAttr('no-copy'),
      copyText: getAttr('copy-text') || 'Copy',
      showShare: hasAttr('show-share'),
      showDownload: hasAttr('show-download'),
    })
  })
}
