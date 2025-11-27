/**
 * Code Block Web Component with Syntax Highlighting and Copy Button
 */
export declare class CodeBlock extends HTMLElement {
  constructor();

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void;

  /**
   * List of attributes to observe for changes
   */
  static readonly observedAttributes: string[];

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void;

  /**
   * The programming language for syntax highlighting
   * Supported: 'css', 'html', 'markup', 'javascript', 'js'
   * @default 'css'
   */
  readonly language: string;

  /**
   * The label displayed in the header
   * @default language.toUpperCase()
   */
  readonly label: string;

  /**
   * Copies the code content to clipboard
   */
  copyCode(): Promise<void>;

  /**
   * Renders the component
   */
  render(): void;

  /**
   * Escapes HTML special characters
   */
  escapeHtml(text: string): string;

  /**
   * Applies syntax highlighting to the code
   */
  applySyntaxHighlighting(escapedText: string): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-block': CodeBlock;
  }
}
