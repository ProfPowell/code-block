# Web Component Standards Analysis

A comparison of tooling, documentation, and approach across the ProfPowell web component suite.

## Repositories Overview

| Repo | Version | Runtime Deps | DevDeps | Maturity |
|------|---------|--------------|---------|----------|
| code-block | 2.3.0 | 1 (highlight.js) | 2 | Production |
| browser-window | 1.0.0 | 1 (code-block) | 17 | Production |
| terminal-window | 2.0.0 | 0 | 26 | Production |
| browser-console | 1.0.0 | 0 | 3 | Production |
| http-component | 0.1.0 | 0 | 7 | Early |

---

## Current State: Build Tooling

| Repo | Bundler | Build Output | Dev Server |
|------|---------|--------------|------------|
| code-block | Vite 6.0.3 | ES + UMD | Vite |
| browser-window | esbuild 0.25 + Vite 7.3.1 | ES only | Vite |
| terminal-window | Vite + Terser | ES + UMD | Vite |
| browser-console | None (manual terser) | ES + minified | None |
| http-component | None | Source only | http-server |

**Issues:**
- Vite version variance (6.0.3 vs 7.3.1)
- browser-console and http-component have no bundler
- Inconsistent output formats (some UMD, some not)

---

## Current State: Testing

| Repo | Unit Tests | E2E Tests | Coverage |
|------|------------|-----------|----------|
| code-block | None | None | None |
| browser-window | @open-wc/testing + chai | None | None |
| terminal-window | Vitest | Playwright | Yes |
| browser-console | None | Playwright | None |
| http-component | @web/test-runner | None | Yes |

**Issues:**
- Three different test runners (Vitest, web-test-runner, @open-wc)
- code-block has no tests at all
- Inconsistent coverage tooling

---

## Current State: Code Quality

| Repo | Linter | Formatter | TypeScript |
|------|--------|-----------|------------|
| code-block | None | None | Manual .d.ts |
| browser-window | ESLint | Prettier | tsc generates .d.ts |
| terminal-window | ESLint | Prettier | Manual .d.ts |
| browser-console | ESLint | Prettier | Manual .d.ts |
| http-component | ESLint 9 | Prettier | Manual .d.ts |

**Issues:**
- code-block has no linting/formatting
- Mixed TypeScript approaches (manual vs generated)
- ESLint versions likely vary

---

## Current State: Documentation

| Repo | README | Demo | API Docs | GitHub Pages |
|------|--------|------|----------|--------------|
| code-block | Full | demo.html | In README | No |
| browser-window | Full | demos/ | custom-elements.json | Yes |
| terminal-window | Full | demo/ | JSDoc + CEM | No |
| browser-console | Full | examples/ | custom-elements.json | No |
| http-component | Full | demo/ | JSDoc + CEM | No |

**Issues:**
- Only browser-window has GitHub Pages
- Demo locations inconsistent (demo.html vs demos/ vs demo/ vs examples/)
- API documentation approach varies

---

## Current State: NPM Package Config

| Repo | type | main | module | exports |
|------|------|------|--------|---------|
| code-block | module | dist/code-block.js | dist/code-block.js | Yes |
| browser-window | module | dist/browser-window.js | dist/browser-window.js | Yes |
| terminal-window | module | dist/*.umd.js | dist/*.es.js | Yes |
| browser-console | module | dist/browser-console.js | dist/browser-console.js | Yes |
| http-component | module | src/http-console.js | src/http-console.js | Yes |

**Issues:**
- http-component points main to src/ (not built)
- terminal-window uses different main (UMD) vs module (ES)
- Inconsistent dist structure

---

## Current State: Scripts

| Script | code-block | browser-window | terminal-window | browser-console | http-component |
|--------|------------|----------------|-----------------|-----------------|----------------|
| dev | `vite` | `vite` | `vite` | - | `http-server` |
| build | `vite build` | complex | `vite build` | custom | - |
| test | - | `wtr` | `vitest` | `playwright` | `wtr` |
| lint | - | `eslint` | `eslint` | `eslint` | `eslint` |
| format | - | `prettier` | `prettier` | `prettier` | `prettier` |
| analyze | - | `cem analyze` | `cem analyze` | `cem analyze` | `cem analyze` |

---

## Final Standard (Decided)

### Required Tooling

All repos MUST have:

```
devDependencies:
  vite: ^6.0.0                                 # Dev server + bundler
  eslint: ^9.0.0                               # Linting
  prettier: ^3.0.0                             # Formatting
  @playwright/test: ^1.57.0                    # E2E testing
  @custom-elements-manifest/analyzer: ^0.11.0  # API docs generation
```

**Total: 5 devDependencies**

### Explicitly NOT Included

- Storybook (too heavy)
- UMD builds (no legacy CDN support)
- TypeScript compilation (manual .d.ts instead)
- Vitest/Jest/web-test-runner (Playwright only)

### Standard package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.js\"",
    "format:check": "prettier --check \"src/**/*.js\"",
    "analyze": "cem analyze --litelement",
    "prepublishOnly": "npm run build && npm run analyze"
  }
}
```

### Standard vite.config.js

```js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/component-name.js',
      formats: ['es'],
      fileName: () => 'component-name.js'
    }
  },
  server: {
    open: '/demo/index.html'
  }
})
```

### Standard Directory Structure

```
repo/
├── src/
│   └── component-name.js      # Main component source (with JSDoc)
├── dist/
│   └── component-name.js      # ES module output (committed)
├── demo/
│   └── index.html             # Interactive demo (becomes GitHub Pages)
├── test/
│   └── component-name.spec.js # Playwright tests
├── component-name.d.ts        # TypeScript definitions (manual)
├── custom-elements.json       # Generated API manifest
├── package.json
├── vite.config.js
├── eslint.config.js
├── .prettierrc
├── playwright.config.js
├── README.md
├── LICENSE
├── CHANGELOG.md
└── CLAUDE.md                  # Claude Code instructions
```

### Standard package.json Exports

```json
{
  "name": "@profpowell/component-name",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/component-name.js",
  "module": "dist/component-name.js",
  "types": "component-name.d.ts",
  "exports": {
    ".": {
      "types": "./component-name.d.ts",
      "import": "./dist/component-name.js",
      "default": "./dist/component-name.js"
    }
  },
  "files": [
    "dist",
    "component-name.d.ts",
    "custom-elements.json",
    "README.md",
    "LICENSE"
  ]
}
```

---

## Project Requirements

### GitHub Pages

Every component MUST have a GitHub Pages site:
- Source: `/demo/index.html` (or `/docs` folder)
- Enable in repo Settings > Pages
- Include live interactive demos
- Cross-link to other components in the suite

### npm Publishing

All components published under `@profpowell` scope:
- `@profpowell/code-block`
- `@profpowell/browser-window`
- `@profpowell/terminal-window`
- `@profpowell/browser-console`
- `@profpowell/http-component`

### Cross-Linking

Each component's README and demo should link to related components:
- Promotes the vanilla web component ecosystem
- Shows how components work together
- Links to GitHub Pages demos of sibling components

### Work Tracking

Use **beads (bd)** for issue tracking across all repos:
- `bd ready` - Find available work
- `bd show <id>` - View issue details
- `bd update <id> --status in_progress` - Claim work
- `bd close <id>` - Complete work
- `bd sync` - Sync with git

---

## Migration Notes Per Repo

### code-block (this repo)
**Status: Needs updates**
- Move `code-block.js` to `src/`
- Move `demo.html` to `demo/index.html`
- Add ESLint + Prettier configs
- Add Playwright tests
- Remove UMD from vite.config.js
- Set up GitHub Pages

### browser-window
**Status: Over-engineered**
- Remove: esbuild, @open-wc/testing, chai, TypeScript compilation
- Keep: Vite, ESLint, Prettier
- Add: Playwright tests
- Pin Vite to ^6.0.0
- Reduce devDeps from 17 to 5

### terminal-window
**Status: Most over-engineered**
- Remove: Storybook (6 packages), Vitest, jsdom, Terser
- Keep: Playwright, ESLint, Prettier
- Remove UMD output
- Reduce devDeps from 26 to 5
- Set up GitHub Pages

### browser-console
**Status: Needs build setup**
- Add: Vite, vite.config.js
- Keep: Playwright, ESLint, Prettier
- Set up GitHub Pages

### http-component
**Status: Early, needs full setup**
- Add: Vite, Playwright
- Remove: http-server, @web/test-runner
- Change main from src/ to dist/
- Set up GitHub Pages

---

## Version Pinning Strategy

1. **Pin major versions only**: `^6.0.0` not `6.0.3`
2. **Commit package-lock.json**: Ensures reproducible builds
3. **Batch updates quarterly**: Don't update on every release
4. **Avoid bleeding edge**: Wait for .0.1 releases minimum

---

## Rationale

| Choice | Rationale |
|--------|-----------|
| Vite only | Single tool for dev + build, fast, well-maintained |
| ES modules only | Modern standard, no legacy baggage, simpler config |
| Playwright | Real browser testing, single tool, great DX |
| Manual .d.ts | Full control, no tsc complexity, no version churn |
| No Storybook | Heavy dependency, overkill for simple components |
| Custom Elements Manifest | Standard web component API documentation |
| JSDoc | Documentation in source, generates types, IDE support |
| GitHub Pages | Free hosting, automatic from repo, promotes usage |
| beads (bd) | Lightweight issue tracking, git-integrated |

---

## Summary

**Current average devDeps:** 11 packages
**Standard devDeps:** 5 packages (55% reduction)

**Standardization wins:**
- Single bundler (Vite 6, ES-only output)
- Single test framework (Playwright)
- Consistent directory structure
- Consistent package.json shape
- All components have GitHub Pages
- All components on npm under @profpowell
- Cross-linked documentation
- beads for work tracking
