# code-block: JSDOM / SSG Compatibility Fix

## Problem

When `<code-block>` is processed by an HTML parser that doesn't understand custom elements (JSDOM, html-minifier-terser, or any SSG build tool), plain-text content inside the element gets parsed as HTML attributes instead of text content.

**Works fine:**
```html
<code-block language="html" data-escape>
  <button type="button">Click</button>
</code-block>
```
After escaping `<` to `&lt;`, the entities survive because parsers recognize them as text.

**Breaks:**
```html
<code-block language="javascript" data-escape>
// Import CSS
import 'vanilla-breeze/css';
</code-block>
```
The parser sees `import`, `'vanilla-breeze/css';` etc. as attribute names/values on the `<code-block>` element because there are no HTML entities to signal "this is text content."

This affects Cook (uses JSDOM for include/component resolution) and any other SSG or build tool that parses HTML before the browser sees it. Only ~5 pages in the VB docs are affected (those with pure JS/text code examples), but it's a fundamental fragility.

## Root Cause

Custom elements are valid HTML, but HTML parsers (per the spec) treat unknown elements as having no special content model. Unlike `<script>`, `<style>`, or `<textarea>` (which have "raw text" or "escapable raw text" content models), `<code-block>` gets the generic "flow content" model. This means:

1. The parser opens `<code-block>`
2. It sees `language="javascript"` — attribute, fine
3. It sees `label="Import..."` — attribute, fine
4. It hits `>` — tag closed
5. It sees `// Import CSS\nimport 'vanilla-breeze/css';`
6. A well-behaved browser creates a text node. But JSDOM and other parsers can misinterpret the whitespace-separated tokens as more attributes if the `>` gets lost during serialization/re-parsing.

## Proposed Fix

### Option A: `<textarea>` Content Source (Recommended)

Support reading code content from a `<textarea>` child element. `<textarea>` has "escapable raw text" content model — parsers MUST treat its content as text, never as HTML.

**Before (current):**
```html
<code-block language="javascript">// Import CSS
import 'vanilla-breeze/css';</code-block>
```

**After (new pattern):**
```html
<code-block language="javascript">
  <textarea>// Import CSS
import 'vanilla-breeze/css';</textarea>
</code-block>
```

**Changes to `code-block.js`:**

1. In `connectedCallback()` (line 150-163), check for a `<textarea>` child before falling back to `textContent`:

```javascript
connectedCallback() {
  // Check for <textarea> content source (SSG-safe)
  const textarea = this.querySelector('textarea');
  if (textarea) {
    this._codeContent = textarea.value || textarea.textContent;
    textarea.remove(); // Clean up — don't display the textarea
  } else {
    this._codeContent = this.textContent;
  }
  // ... rest unchanged
}
```

2. In `copyCode()` (line 502-508), `render()`, and `getCode()` — no changes needed. They already use `this._codeContent || this.textContent` which will have the textarea content.

3. In `_getSourceCode()` / `fetchSourceCode()` — no changes needed. The `src` attribute path is unaffected.

**Backwards compatible:** Pages using the current pattern (direct text content) continue to work. The `<textarea>` is only needed for SSG builds where parsers might mangle the content.

### Option B: `<template>` Content Source

Similar to Option A but using `<template>` instead of `<textarea>`. Templates have a document fragment content model that parsers don't execute.

```html
<code-block language="javascript">
  <template>// Import CSS
import 'vanilla-breeze/css';</template>
</code-block>
```

```javascript
connectedCallback() {
  const template = this.querySelector('template');
  if (template) {
    this._codeContent = template.content.textContent;
  } else {
    this._codeContent = this.textContent;
  }
  // ...
}
```

**Tradeoff:** `<template>` content is in a document fragment, so `textContent` may behave differently across parsers. `<textarea>` is more universally reliable.

### Option C: Always Use `src` Attribute

Move all code examples to external `.txt` or `.html` files and reference them:

```html
<code-block language="javascript" src="/docs/snippets/code/js-import.txt"></code-block>
```

**Tradeoff:** More files to manage, harder to author inline.

## Recommendation

**Go with Option A (`<textarea>`).** It's:
- One small change to `connectedCallback()`
- Fully backwards compatible
- Works with every HTML parser (JSDOM, parse5, html-minifier, etc.)
- The `<textarea>` is removed on connect, so it never renders

Then update the Cook `escape-code-blocks.js` plugin to wrap escaped content in `<textarea>` instead of putting it directly in the element. For the ~5 affected pages in the VB docs, either the conversion script or a manual edit wraps the content.

## Files to Change

| File | Change |
|------|--------|
| `~/src/code-block/src/code-block.js` | Add `<textarea>` check in `connectedCallback()` |
| `~/src/code-block/package.json` | Bump version to 2.6.0 |
| `~/src/cook/scripts/plugins/escape-code-blocks.js` | Wrap escaped content in `<textarea>` |
| `~/src/vanilla-breeze/site-cook/src/pages/docs/quick-start.html` | Revert manual escaping hack |
| Publish `@profpowell/code-block@2.6.0` to npm | Then update VB dependency |

## Testing

1. Verify `<textarea>` content renders the same as direct text content
2. Verify copy-to-clipboard copies the unescaped code
3. Verify syntax highlighting works
4. Verify `src` attribute loading still works
5. Build VB docs with Cook — the quick-start page should render correctly
6. Verify the 11ty site still works (backwards compatible)
