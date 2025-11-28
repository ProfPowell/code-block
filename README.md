# code-block

A feature-rich code block web component with syntax highlighting, copy-to-clipboard, and extensive customization options. Designed for tutorials, documentation, and educational content.

## Highlights

> **[See the live demo](demo.html)** for all features in action

| Feature | Description |
|---------|-------------|
| [**Multi-File Tabs**](demo.html#multi-file-tabs) | Tabbed interface for related code files with `<code-block-group>` |
| [**Line Highlighting**](demo.html#line-highlighting) | Draw attention to specific lines with `highlight-lines="3,5-7"` |
| [**Share & Download**](demo.html#share-download) | One-click download or open in CodePen |
| [**Collapsible Blocks**](demo.html#collapsible) | Expandable code with "Show more" for long snippets |
| [**Lazy Loading**](demo.html#lazy-highlighting) | Defer syntax highlighting until visible for performance |
| [**Diff Support**](demo.html#diff-support) | Visualize code changes with +/- line highlighting |
| [**Custom Themes**](demo.html#css-custom-properties) | Full CSS custom property support for branding |
| [**Light & Dark**](demo.html#themes) | GitHub-inspired color schemes |

## Features

- **13 Web Languages** - HTML, CSS, JS, JSON, YAML, PHP, and more
- **Line Numbers** - Optional line number display
- **Filename Headers** - Show file paths in the header
- **Copy to Clipboard** - One-click copy with visual feedback
- **Word Wrap** - Toggle between scroll and wrap for long lines
- **Shadow DOM** - Encapsulated styles that won't conflict with your app
- **Accessible** - ARIA labels, keyboard focus, screen reader support
- **TypeScript Support** - Full type definitions included

## Installation

### npm

```bash
npm install @profpowell/code-block
```

### Git Submodule

Add this repository as a git submodule to your project:

```bash
git submodule add https://github.com/ProfPowell/code-block.git lib/code-block
cd lib/code-block && npm install
```

Then import the component:

```javascript
import './lib/code-block/code-block.js';
```

## Usage

Once imported, the `<code-block>` custom element is automatically registered:

```html
<code-block language="javascript">
function greet(name) {
  return `Hello, ${name}!`;
}
</code-block>
```

### With Custom Label

```html
<code-block language="python" label="Data Processing">
import pandas as pd

df = pd.read_csv('data.csv')
print(df.head())
</code-block>
```

### Dark Theme

```html
<code-block language="css" theme="dark">
.container {
  display: grid;
  gap: 1rem;
}
</code-block>
```

### With Line Numbers

```html
<code-block language="javascript" show-lines>
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }
}
</code-block>
```

### Combined Options

```html
<code-block language="typescript" theme="dark" show-lines label="User Service">
interface User {
  id: number;
  name: string;
}

class UserService {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}
</code-block>
```

## Supported Languages

The component includes an optimized bundle with 13 web development languages:

| Language | Values |
|----------|--------|
| HTML | `html`, `markup` |
| XML | `xml` |
| XHTML | `xhtml` |
| SVG | `svg` |
| CSS | `css` |
| JavaScript | `javascript`, `js` |
| JSON | `json` |
| YAML | `yaml`, `yml` |
| PHP | `php` |
| HTTP | `http` |
| Diff | `diff` |
| Plain Text | `plaintext`, `text`, `txt` |
| CSV | `csv` |

Additional languages can be added by importing them from highlight.js.

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `language` | string | `'plaintext'` | Programming language for highlighting |
| `label` | string | `language` | Label displayed in the header |
| `theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `show-lines` | boolean | `false` | Display line numbers |
| `filename` | string | — | File path shown in header |
| `highlight-lines` | string | — | Lines to highlight (e.g., `"3,5-7"`) |
| `collapsed` | boolean | `false` | Start in collapsed state |
| `max-lines` | number | `10` | Lines visible when collapsed |
| `max-height` | string | — | Max height with scrolling (e.g., `"300px"`) |
| `wrap` | boolean | `false` | Wrap long lines |
| `copy-text` | string | `'Copy'` | Custom copy button text |
| `copied-text` | string | `'Copied!'` | Custom success message |
| `show-share` | boolean | `false` | Show share button |
| `show-download` | boolean | `false` | Show download button |
| `lazy` | boolean | `false` | Defer highlighting until visible |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `copyCode()` | `Promise<void>` | Copy code to clipboard |
| `setCode(code)` | `void` | Update code content |
| `getCode()` | `string` | Get current code |
| `downloadCode()` | `void` | Download as file |
| `openInCodePen()` | `void` | Open in CodePen |
| `toggleCollapsed()` | `void` | Toggle collapsed state |
| `render()` | `void` | Re-render the component |

### Programmatic Usage

```javascript
// Get a reference to a code block
const codeBlock = document.querySelector('code-block');

// Copy code programmatically
await codeBlock.copyCode();

// Update code content dynamically
codeBlock.setCode('const updated = true;');

// Get current code
const code = codeBlock.getCode();

// Get all supported languages (static method)
const languages = CodeBlock.getSupportedLanguages();
console.log(`Supports ${languages.length} languages`);
```

## Demo

Open `demo.html` in a browser to see all features in action:

- [Multi-file tabbed interface](demo.html#multi-file-tabs)
- [Line highlighting](demo.html#line-highlighting)
- [Share & download buttons](demo.html#share-download)
- [Collapsible code blocks](demo.html#collapsible)
- [Lazy loading for performance](demo.html#lazy-highlighting)
- [Diff visualization](demo.html#diff-support)
- [CSS custom properties](demo.html#css-custom-properties)
- [Light and dark themes](demo.html#themes)
- Complete API reference

## Browser Support

Works in all modern browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES6 Modules
- Clipboard API

## Dependencies

- [highlight.js](https://highlightjs.org/) ^11.11.1 - Syntax highlighting

## License

MIT License - see [LICENSE](LICENSE) for details.
