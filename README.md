# code-block

A simple code block web component with syntax highlighting and copy-to-clipboard functionality. Designed for use in tutorials and documentation.

## Installation

### Git Submodule (Recommended for Private Use)

Add this repository as a git submodule to your project:

```bash
git submodule add https://github.com/ProfPowell/code-block.git lib/code-block
```

Then import the component:

```javascript
import '@profpowell/code-block';
// or
import { CodeBlock } from './lib/code-block/code-block.js';
```

### Direct Copy

Copy `code-block.js` directly into your project and import it:

```javascript
import './path/to/code-block.js';
```

## Usage

Once imported, the `<code-block>` custom element is automatically registered and ready to use:

```html
<code-block language="css">
.container {
  display: flex;
  justify-content: center;
}
</code-block>
```

### With Custom Label

```html
<code-block language="javascript" label="Example Function">
function greet(name) {
  return `Hello, ${name}!`;
}
</code-block>
```

### Supported Languages

- `css` - CSS stylesheets
- `html` / `markup` - HTML markup
- `javascript` / `js` - JavaScript code

## API

### Attributes

| Attribute  | Type   | Default               | Description                          |
|------------|--------|-----------------------|--------------------------------------|
| `language` | string | `'css'`               | Programming language for highlighting |
| `label`    | string | `language.toUpperCase()` | Label displayed in the header        |

### Properties

| Property   | Type   | Description                              |
|------------|--------|------------------------------------------|
| `language` | string | Gets the language attribute value        |
| `label`    | string | Gets the label attribute value           |

### Methods

| Method      | Returns        | Description                        |
|-------------|----------------|------------------------------------|
| `copyCode()` | `Promise<void>` | Copies code content to clipboard   |
| `render()`   | `void`         | Re-renders the component           |

## Features

- **Syntax Highlighting**: Built-in highlighting for CSS, HTML, and JavaScript
- **Copy Button**: One-click copy with visual feedback
- **Shadow DOM**: Encapsulated styles that won't conflict with your application
- **Zero Dependencies**: Pure vanilla JavaScript, no external libraries required
- **TypeScript Support**: Includes type definitions for IDE autocompletion

## Styling

The component uses Shadow DOM for style encapsulation. The default theme uses GitHub-inspired colors.

## Browser Support

Works in all modern browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES6 Modules

## License

MIT License - see [LICENSE](LICENSE) for details.
