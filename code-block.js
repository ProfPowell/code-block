/**
 * Code Block Web Component with Syntax Highlighting and Copy Button
 * Based on syntax-highlight-element but with added copy functionality
 */
export class CodeBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['language', 'label'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot) {
      this.render();
    }
  }

  get language() {
    return this.getAttribute('language') || 'css';
  }

  get label() {
    return this.getAttribute('label') || this.language.toUpperCase();
  }

  async copyCode() {
    // Get raw text content
    const rawCode = this.textContent.trim();

    // Unescape HTML entities (convert &lt; to <, &gt; to >, etc.)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawCode;
    const unescapedCode = tempDiv.textContent;

    try {
      await navigator.clipboard.writeText(unescapedCode);
      const button = this.shadowRoot.querySelector('.copy-button');
      const originalText = button.textContent;
      button.textContent = 'Copied';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }

  render() {
    const code = this.textContent.trim();
    const escapedCode = this.escapeHtml(code);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e1e4e8;
          background: #f6f8fa;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #e1e4e8;
          border-bottom: 1px solid #d1d5da;
        }

        .label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #586069;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .copy-button {
          background: #fff;
          border: 1px solid #d1d5da;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #24292e;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .copy-button:hover {
          background: #f3f4f6;
          border-color: #959da5;
        }

        .copy-button:active {
          background: #e1e4e8;
          transform: scale(0.98);
        }

        .copy-button.copied {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .code-container {
          padding: 1rem;
          overflow-x: auto;
          background: #fff;
        }

        pre {
          margin: 0;
          padding: 0;
          font-size: 0.875rem;
          line-height: 1.6;
        }

        code {
          display: block;
          font-family: inherit;
          color: #24292e;
        }

        /* Syntax highlighting styles */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6a737d;
          font-style: italic;
        }

        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #005cc5;
        }

        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #22863a;
        }

        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
          color: #d73a49;
        }

        .token.atrule,
        .token.attr-value,
        .token.keyword {
          color: #d73a49;
        }

        .token.function,
        .token.class-name {
          color: #6f42c1;
        }

        .token.regex,
        .token.important,
        .token.variable {
          color: #e36209;
        }
      </style>
      <div class="header">
        <span class="label">${this.escapeHtml(this.label)}</span>
        <button class="copy-button" title="Copy code">Copy</button>
      </div>
      <div class="code-container">
        <pre><code class="language-${this.language}">${escapedCode}</code></pre>
      </div>
    `;

    // Add copy button event listener
    const button = this.shadowRoot.querySelector('.copy-button');
    button.addEventListener('click', () => this.copyCode());

    // Apply basic syntax highlighting with the escaped code
    this.applySyntaxHighlighting(escapedCode);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  applySyntaxHighlighting(escapedText) {
    const code = this.shadowRoot.querySelector('code');
    let highlighted = escapedText;

    if (this.language === 'css') {
      // Simple CSS highlighting - process in order to avoid regex conflicts
      // Use placeholders to protect highlighted content from subsequent replacements
      const tokens = [];
      let tokenIndex = 0;

      // Comments first
      highlighted = escapedText.replace(/(\/\*[\s\S]*?\*\/)/g, (match) => {
        const placeholder = `__TOKEN_${tokenIndex}__`;
        tokens[tokenIndex] = `<span class="token comment">${match}</span>`;
        tokenIndex++;
        return placeholder;
      });

      // Selectors (before opening brace)
      highlighted = highlighted.replace(/^([^{]+)(?={)/gm, (match) => {
        // Skip if this line only contains placeholders
        if (match.trim().startsWith('__TOKEN_')) return match;
        return match.replace(/([.#]?[\w-]+)/g, (selectorMatch) => {
          // Don't highlight placeholder tokens
          if (selectorMatch.startsWith('__TOKEN_')) return selectorMatch;
          return `<span class="token selector">${selectorMatch}</span>`;
        });
      });

      // Properties
      highlighted = highlighted.replace(/(\w[\w-]*)\s*:/g, (match, prop) => {
        // Don't highlight placeholder tokens
        if (prop.startsWith('__TOKEN_')) return match;
        return `<span class="token property">${prop}</span>:`;
      });

      // Values
      highlighted = highlighted.replace(/:\s*([^;{]+)/g, (match, value) => {
        // Don't process values containing placeholder tokens
        if (value.includes('__TOKEN_')) return match;
        // Colors
        value = value.replace(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/g, '<span class="token number">$1</span>');
        // Numbers with units
        value = value.replace(/(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms)?)/g, '<span class="token number">$1</span>');
        // Keywords
        value = value.replace(/\b(important|inherit|initial|unset|auto|none|solid|dashed|dotted|bold|italic|normal|flex|grid|block|inline|inline-block)\b/g, '<span class="token keyword">$1</span>');
        return ': ' + value;
      });

      // Restore comment tokens
      highlighted = highlighted.replace(/__TOKEN_(\d+)__/g, (match, index) => tokens[index]);
    } else if (this.language === 'html' || this.language === 'markup') {
      // Simple HTML highlighting with placeholder protection
      const htmlTokens = [];
      let htmlTokenIndex = 0;

      // First, protect comments
      highlighted = escapedText.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (match) => {
        const placeholder = `__HTMLTOKEN_${htmlTokenIndex}__`;
        htmlTokens[htmlTokenIndex] = `<span class="token comment">${match}</span>`;
        htmlTokenIndex++;
        return placeholder;
      });

      // Protect and highlight complete tags with their attributes
      highlighted = highlighted.replace(/(&lt;\/?[\w-]+[^&]*?&gt;)/g, (match) => {
        // First, unescape to work with actual < > characters
        let unescaped = match.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
        let tagHighlighted = '';

        // Match opening tag with optional attributes
        const tagMatch = unescaped.match(/^<(\/?)([^\s>]+)([^>]*)>$/);
        if (tagMatch) {
          const [, slash, tagName, attrs] = tagMatch;
          tagHighlighted += '<span class="token tag">&lt;' + slash + tagName;

          if (attrs) {
            // Process attributes
            let processedAttrs = attrs.replace(/\s+([\w-]+)="([^"]*)"/g, (m, attrName, attrValue) => {
              return ' <span class="token attr-name">' + attrName + '</span>=<span class="token attr-value">"' + attrValue + '"</span>';
            });
            tagHighlighted += processedAttrs;
          }

          tagHighlighted += '&gt;</span>';
        } else {
          tagHighlighted = match;
        }

        const placeholder = `__HTMLTOKEN_${htmlTokenIndex}__`;
        htmlTokens[htmlTokenIndex] = tagHighlighted;
        htmlTokenIndex++;
        return placeholder;
      });

      // Restore all tokens
      highlighted = highlighted.replace(/__HTMLTOKEN_(\d+)__/g, (match, index) => htmlTokens[index]);
    } else if (this.language === 'javascript' || this.language === 'js') {
      // Simple JavaScript highlighting
      highlighted = escapedText
        // Comments
        .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="token comment">$1</span>')
        // Strings
        .replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="token string">$1$2$1</span>')
        // Keywords
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g, '<span class="token keyword">$1</span>')
        // Functions
        .replace(/\b([a-zA-Z_$][\w$]*)\s*\(/g, '<span class="token function">$1</span>(');
    }

    code.innerHTML = highlighted;
  }
}

customElements.define('code-block', CodeBlock);
