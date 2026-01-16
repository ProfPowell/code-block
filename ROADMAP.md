# Code Block Component Roadmap

This document outlines possible features and improvements for the `<code-block>` web component.

---

## High Value for Tutorials

### Focus Mode
Dim/blur non-highlighted lines to draw attention to the highlighted code. Pairs naturally with the existing `highlight-lines` attribute.

**Use Case:** Drawing attention to specific code in tutorials without hiding context
**Priority:** High
**Complexity:** Low

### Line Annotations
Add explanatory tooltips or callouts to specific lines via an attribute like `annotations="3:This fetches data,7:Error handling"`.

**Use Case:** Inline explanations without cluttering code with comments
**Priority:** High
**Complexity:** Medium

### External File Loading
Load code from a URL via `src` attribute: `<code-block src="./example.js" language="javascript">`.

**Use Case:** Keep demo code in sync with actual source files, reduce HTML clutter
**Priority:** High
**Complexity:** Low

### Step-Through Mode
Animate through highlighted lines sequentially for guided walkthroughs. Could use buttons or auto-advance.

**Use Case:** Interactive tutorials, code walkthroughs, presentations
**Priority:** Medium
**Complexity:** Medium

---

## Developer Experience

### Line Linking
Deep link to specific lines via URL hash, e.g., `demo.html#code-block-1:L5-L10`. Scroll to and highlight the referenced lines.

**Use Case:** Share links to specific code sections, documentation cross-references
**Priority:** High
**Complexity:** Low

### Keyboard Shortcuts
Add keyboard navigation: Copy (Cmd/Ctrl+C when focused), expand/collapse (Enter), navigate tabs (Arrow keys already done for groups).

**Use Case:** Power users, accessibility improvements
**Priority:** Medium
**Complexity:** Low

### Print Styles
Optimized CSS for printing code blocks in documentation. Ensure syntax colors work in print, remove interactive buttons.

**Use Case:** Printable documentation, PDF generation
**Priority:** Low
**Complexity:** Low

### Language Auto-Detection
Automatically detect the programming language from code content when the `language` attribute is not specified.

**Use Case:** Convenience when language is obvious, user-submitted code
**Priority:** Low
**Complexity:** Medium

---

## Extended Language Support

### Additional Languages
Add support for more languages commonly used in web development and beyond.

**Candidates:** Python, Bash/Shell, SQL, Markdown, TypeScript, Ruby, Go, Rust, Java, C/C++
**Use Case:** Broader documentation coverage, backend tutorials
**Priority:** Medium
**Complexity:** Low (highlight.js already supports them)

### Terminal Mode
Special styling for shell commands with prompt indicators (`$`, `>`, `#`). Auto-detect or use `language="terminal"`.

**Use Case:** Installation instructions, CLI tutorials, DevOps documentation
**Priority:** Medium
**Complexity:** Medium

---

## Advanced Features

### Editable Mode
Allow users to edit code directly in the code block for interactive tutorials. Could emit events on change.

**Use Case:** Interactive coding exercises, live examples, playgrounds
**Priority:** Medium
**Complexity:** High

### Code Execution
Run JavaScript/CSS in a sandboxed iframe with live preview. Show output or rendered result alongside code.

**Use Case:** Interactive documentation, live demos, educational content
**Priority:** Low
**Complexity:** High

### Tab Diffing
Show visual diff between two tabs in a `<code-block-group>`. Highlight additions/removals between versions.

**Use Case:** Showing code evolution, before/after comparisons
**Priority:** Low
**Complexity:** High

### Server-Side Rendering Support
Pre-highlight code at build time for faster initial render.

**Use Case:** Static site generators, documentation sites (Astro, 11ty, vanilla JS with Vite)
**Priority:** Low
**Complexity:** High - Requires build plugin

---

## Priority Legend

| Priority | Description |
|----------|-------------|
| **High** | Core tutorial/documentation features, should implement soon |
| **Medium** | Nice to have, implement when time permits |
| **Low** | Future consideration, implement if requested |

## Complexity Legend

| Complexity | Description |
|------------|-------------|
| **Low** | Can be implemented in a few hours |
| **Medium** | Requires careful design, a day or two of work |
| **High** | Significant effort, may require architectural changes |

---

## Contributing

Feature requests and contributions are welcome. Please open an issue to discuss new features before submitting a pull request.
