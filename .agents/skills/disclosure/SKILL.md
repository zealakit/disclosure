---
name: disclosure
description: >-
  Disclosure monorepo architecture: headless Collapsible/Accordion packages for
  React, Vue, Svelte, and Vanilla JS. Use when editing packages/, examples/,
  READMEs, or asking where files belong, how animation/presence works, or how to
  keep packages aligned.
---

# Disclosure

This repo ships **framework-specific** headless primitives. Agents must keep APIs and behavior aligned across packages without introducing a shared runtime.

## What it is

- **Collapsible** — single open/closed panel
- **Accordion** — grouped panels (single or multiple)
- Behavior + a11y only — consumers own visual styling via `data-slot` / `data-state`
- Built-in CSS grid height animation (`minmax(0, 0fr)` ↔ `minmax(0, 1fr)`), enabled by default
- Respect `prefers-reduced-motion`

## Package boundaries

| Path | Publish name | Notes |
| --- | --- | --- |
| `packages/react/` | `@zealakit/disclosure-react` | No `"use client"` in the package — apps add it |
| `packages/vue/` | `@zealakit/disclosure-vue` | Vue 3.5+ |
| `packages/svelte/` | `@zealakit/disclosure-svelte` | Svelte 5 |
| `packages/vanilla/` | `@zealakit/disclosure-vanilla` | Declarative `data-*` + `createDisclosure()`; ESM + IIFE CDN (`ZealakitDisclosure`); no framework peers |

Do **not** add a shared runtime package. Mirror behavior across packages when it is shared (animation timing/duration/delay, `forceMount`, presence lifecycle, a11y). Vanilla uses HTML attributes instead of framework props — keep the contract aligned, not the implementation.

## Typical source layout (per package)

```
src/
  collapsible.*      # root / trigger / content
  accordion.*        # root / item / trigger / content + context
  animation.*        # CSS vars / style helpers for timing
  use-presence.*     # enter/exit presence (framework-specific)
  *-styles.*         # data attributes / class hooks
  index.*            # public exports
tests/
```

## Animation / DOM rules

- Animate height on the **viewport**; put borders/padding/backgrounds on the **inner content wrapper** (`data-collapsible-content-wrapper`), not the animated viewport.
- Use `minmax(0, …)` floors — bare `0fr` can leave exit artifacts.
- Expose animation config via CSS variables / props (`timing`, `duration`, `delay`) consistently across frameworks.

## Docs

- Root README is the overview; package READMEs hold full API.
- Maintain `README.md` (EN), `README_VI.md`, `README_CN.md` together.
- Prefer GitHub blob links for cross-README language switchers and cover images.

## Examples

`examples/*` consume workspace packages for manual verification. After package changes, rebuild (`pnpm build` or the matching `build:*`) before relying on a running example.
