# Work Status - code-block

Last updated: 2026-01-19

---

## Planning / Future Work



### From ROADMAP.md

#### High Priority
| Feature | Description | Complexity |
|---------|-------------|------------|
| Line Annotations | Tooltips/callouts on specific lines | Medium |
| External File Loading | Load code from URL via `src` attribute | Low |
| Line Linking | Deep link to lines via URL hash | Low |

#### Medium Priority
| Feature | Description | Complexity |
|---------|-------------|------------|
| Step-Through Mode | Animate through highlighted lines | Medium |
| Keyboard Shortcuts | Copy, expand/collapse, tab navigation | Low |
| Terminal Mode | Special styling for shell commands | Medium |
| Editable Mode | Allow users to edit code directly | High |

#### Low Priority
| Feature | Description | Complexity |
|---------|-------------|------------|
| Print Styles | Optimized CSS for printing | Low |
| Language Auto-Detection | Detect language from content | Medium |
| Code Execution | Run JS/CSS with live preview | High |
| Tab Diffing | Visual diff between tabs | High |
| SSR Support | Pre-highlight at build time | High |

#### Recently Completed from Roadmap
- **Focus Mode**: Dim/blur non-highlighted lines with `focus-mode` attribute. Includes CSS custom properties `--cb-focus-dim-opacity` and `--cb-focus-blur` for customization.
- **Additional Languages** (partial): Added Python, Bash/Shell, TypeScript to highlight.js bundle

---

## Reference Links

- **Live Site:** https://profpowell.github.io/code-block/
- **npm Package:** https://www.npmjs.com/package/@profpowell/code-block


- **GitHub:** https://github.com/ProfPowell/code-block
