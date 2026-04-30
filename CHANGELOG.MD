- **v2.8.0** (Current)
	- Implement `start-line` attribute (was previously documented but a no-op): the gutter now begins numbering from the supplied value
	- Add `end-line` attribute for rendering a slice of a longer source while preserving its absolute line numbers; copy/download return only the visible slice
	- Fix multi-line span breakage in highlighted output — JS template literals, multi-line comments, and triple-quoted strings now keep their `hljs-*` spans (and any nested children like `hljs-subst`) properly contained within each `.code-line` wrapper
	- Document that `highlight-lines` matches the displayed (absolute) line numbers when `start-line` is set

- **v2.7.2**
	- Fix copy button stripping HTML tags from copied code

- **v2.3.0**
	- Lazy highlighting for performance (`lazy` attribute)
	- IntersectionObserver-based deferred rendering

- **v2.2.0**
	- Share button with dropdown menu (`show-share`)
	- Download code as file (`show-download`)
	- Open in CodePen integration
	- Web Share API support

- **v2.1.0**
	- Line highlighting with range support
	- Filename header display
	- CSS custom properties for full theming
	- Diff support with added/removed line styling
	- Collapsible code blocks (collapsed, max-lines)
	- Max height with scroll
	- Word wrap option
	- Copy button text customization
	- Multi-file tabs (`<code-block-group>`)
	- Optimized bundle (13 web dev languages)

- **v2.0.0**
	- Migrated to highlight.js
	- Added dark theme support
	- Added line numbers
	- Improved accessibility
	- Added Vite build system

- **v1.0.0**
	- Initial release
	- Custom regex-based highlighting
	- Copy to clipboard
	- Shadow DOM encapsulation