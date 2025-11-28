/**
 * Code Block Web Component with Syntax Highlighting and Copy Button
 * Uses highlight.js for syntax highlighting (limited language bundle)
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
  static readonly observedAttributes: readonly ['language', 'label', 'theme', 'show-lines', 'filename', 'highlight-lines', 'collapsed', 'max-lines', 'max-height', 'wrap', 'copy-text', 'copied-text', 'show-share', 'show-download', 'lazy'];

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void;

  /**
   * The programming language for syntax highlighting.
   * Supported: 'html', 'css', 'javascript', 'js', 'json', 'yaml', 'yml', 'php', 'http', 'plaintext', 'text', 'txt', 'csv'
   * @default 'plaintext'
   */
  readonly language: string;

  /**
   * The label displayed in the header.
   * Falls back to filename if set, otherwise language name.
   * @default language.toUpperCase()
   */
  readonly label: string;

  /**
   * The color theme for the code block
   * @default 'light'
   */
  readonly theme: 'light' | 'dark';

  /**
   * Whether to display line numbers
   * Set via the `show-lines` attribute
   * @default false
   */
  readonly showLines: boolean;

  /**
   * The filename displayed in the header (optional)
   * Shows language badge + filename when set
   */
  readonly filename: string;

  /**
   * Set of line numbers to highlight
   * Parsed from `highlight-lines` attribute
   * Supports individual lines (1,3,5) and ranges (1-5)
   */
  readonly highlightLines: Set<number>;

  /**
   * Whether the code block is collapsed
   * Set via the `collapsed` attribute
   * @default false
   */
  readonly collapsed: boolean;

  /**
   * Maximum number of lines to show when collapsed
   * Set via the `max-lines` attribute
   * @default 10
   */
  readonly maxLines: number;

  /**
   * Maximum height of the code container with scrolling
   * Set via the `max-height` attribute (e.g., "300px")
   */
  readonly maxHeight: string;

  /**
   * Whether to wrap long lines instead of horizontal scrolling
   * Set via the `wrap` attribute
   * @default false
   */
  readonly wrap: boolean;

  /**
   * Custom text for the copy button
   * Set via the `copy-text` attribute
   * @default 'Copy'
   */
  readonly copyText: string;

  /**
   * Custom text shown after successful copy
   * Set via the `copied-text` attribute
   * @default 'Copied!'
   */
  readonly copiedText: string;

  /**
   * Whether to show the share button
   * Set via the `show-share` attribute
   * @default false
   */
  readonly showShare: boolean;

  /**
   * Whether to show the download button
   * Set via the `show-download` attribute
   * @default false
   */
  readonly showDownload: boolean;

  /**
   * Whether to use lazy highlighting (defer until visible)
   * Set via the `lazy` attribute
   * @default false
   */
  readonly lazy: boolean;

  /**
   * Copies the code content to clipboard.
   * Shows visual feedback on success or failure.
   */
  copyCode(): Promise<void>;

  /**
   * Downloads the code as a file with appropriate extension
   */
  downloadCode(): void;

  /**
   * Opens the code in CodePen
   */
  openInCodePen(): void;

  /**
   * Share via Web Share API (if available)
   */
  shareViaWebAPI(): Promise<void>;

  /**
   * Toggle share menu visibility
   */
  toggleShareMenu(): void;

  /**
   * Renders the component with syntax highlighting
   */
  render(): void;

  /**
   * Renders a placeholder without syntax highlighting (for lazy loading)
   */
  renderPlaceholder(): void;

  /**
   * Toggle collapsed state
   */
  toggleCollapsed(): void;

  /**
   * Escapes HTML special characters
   */
  escapeHtml(text: string): string;

  /**
   * Update the code content programmatically
   */
  setCode(code: string): void;

  /**
   * Get the current code content
   */
  getCode(): string;

  /**
   * Get list of supported languages
   */
  static getSupportedLanguages(): string[];
}

/**
 * CSS Custom Properties for theming
 *
 * Layout:
 * --cb-margin: Component margin (default: 1rem 0)
 * --cb-border-radius: Border radius (default: 8px)
 * --cb-border-color: Border color
 * --cb-font-family: Code font family
 * --cb-font-size: Code font size (default: 0.875rem)
 *
 * Colors:
 * --cb-bg: Component background
 * --cb-header-bg: Header background
 * --cb-code-bg: Code area background
 * --cb-text-color: Default text color
 * --cb-label-color: Label text color
 * --cb-filename-color: Filename text color
 *
 * Line Numbers:
 * --cb-line-numbers-bg: Line numbers background
 * --cb-line-numbers-color: Line numbers text color
 * --cb-line-numbers-highlight-color: Highlighted line number color
 *
 * Line Highlighting:
 * --cb-highlight-bg: Highlighted line background
 * --cb-highlight-border: Highlighted line left border
 * --cb-highlight-gutter: Highlighted line number background
 *
 * Button:
 * --cb-button-bg: Copy button background
 * --cb-button-border: Copy button border
 * --cb-button-color: Copy button text color
 * --cb-button-hover-bg: Copy button hover background
 * --cb-focus-color: Focus outline color
 * --cb-success-color: Success state color
 * --cb-error-color: Error state color
 *
 * Syntax Highlighting:
 * --cb-comment: Comment color
 * --cb-keyword: Keyword color
 * --cb-string: String color
 * --cb-number: Number color
 * --cb-function: Function name color
 * --cb-attribute: Attribute color
 * --cb-tag: HTML tag color
 * --cb-meta: Meta/operator color
 * --cb-builtin: Built-in function color
 *
 * Diff Colors:
 * --cb-diff-add-bg: Added line background
 * --cb-diff-add-border: Added line left border
 * --cb-diff-add-gutter: Added line number background
 * --cb-diff-add-color: Added line number color
 * --cb-diff-add-text: Added text color
 * --cb-diff-remove-bg: Removed line background
 * --cb-diff-remove-border: Removed line left border
 * --cb-diff-remove-gutter: Removed line number background
 * --cb-diff-remove-color: Removed line number color
 * --cb-diff-remove-text: Removed text color
 *
 * Collapsible:
 * --cb-expand-bg: Expand button background
 * --cb-expand-color: Expand button text color
 * --cb-expand-hover-bg: Expand button hover background
 *
 * Scrollbar (max-height):
 * --cb-scrollbar-track: Scrollbar track background
 * --cb-scrollbar-thumb: Scrollbar thumb color
 * --cb-scrollbar-thumb-hover: Scrollbar thumb hover color
 */

/**
 * Code Block Group - Tabbed interface for multiple code blocks
 */
export declare class CodeBlockGroup extends HTMLElement {
  constructor();

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback(): void;

  /**
   * Called when the element is removed from the DOM
   */
  disconnectedCallback(): void;

  /**
   * List of attributes to observe for changes
   */
  static readonly observedAttributes: readonly ['theme', 'show-share', 'show-download'];

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void;

  /**
   * The color theme for the code block group
   * @default 'light'
   */
  readonly theme: 'light' | 'dark';

  /**
   * Whether to show the share button
   * Set via the `show-share` attribute
   * @default false
   */
  readonly showShare: boolean;

  /**
   * Whether to show the download button
   * Set via the `show-download` attribute
   * @default false
   */
  readonly showDownload: boolean;

  /**
   * Get all child code-block elements
   */
  readonly codeBlocks: CodeBlock[];

  /**
   * Get/set the currently active tab index
   */
  activeIndex: number;

  /**
   * Renders the component
   */
  render(): void;

  /**
   * Programmatically select a tab by index
   */
  selectTab(index: number): void;

  /**
   * Get the currently active code block
   */
  getActiveBlock(): CodeBlock | undefined;

  /**
   * Toggle share menu visibility
   */
  toggleShareMenu(): void;

  /**
   * Downloads the code from the active block as a file
   */
  downloadCode(): void;

  /**
   * Opens all blocks' code in CodePen (aggregates HTML, CSS, JS)
   */
  openInCodePen(): void;

  /**
   * Share all blocks' code via Web Share API (if available)
   */
  shareViaWebAPI(): Promise<void>;

  /**
   * Escapes HTML special characters
   */
  escapeHtml(text: string): string;
}

/**
 * Event detail for tab-change event
 */
export interface TabChangeEventDetail {
  index: number;
  block: CodeBlock;
}

declare global {
  interface HTMLElementTagNameMap {
    'code-block': CodeBlock;
    'code-block-group': CodeBlockGroup;
  }

  interface HTMLElementEventMap {
    'tab-change': CustomEvent<TabChangeEventDetail>;
  }

  namespace JSX {
    interface IntrinsicElements {
      'code-block': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          language?: string;
          label?: string;
          theme?: 'light' | 'dark';
          'show-lines'?: boolean;
          filename?: string;
          'highlight-lines'?: string;
          collapsed?: boolean;
          'max-lines'?: number | string;
          'max-height'?: string;
          wrap?: boolean;
          'copy-text'?: string;
          'copied-text'?: string;
          'show-share'?: boolean;
          'show-download'?: boolean;
          lazy?: boolean;
        },
        HTMLElement
      >;
      'code-block-group': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          theme?: 'light' | 'dark';
          'show-share'?: boolean;
          'show-download'?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
