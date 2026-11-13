# Disclosure Vanilla Skill

Practical instructions for AI coding agents using `@zealakit/disclosure-vanilla`.

## A. Overview

Disclosure provides **headless** Collapsible and Accordion primitives for vanilla JavaScript and static HTML.

- Declarative HTML via `data-*` attributes + a small `createDisclosure()` initializer.
- State, accessibility, and built-in height animation are included.
- Visual styling is owned by the consumer (CSS via `data-slot` / `data-state`).
- Put padding, borders, and backgrounds on the content element’s class/style (moved to `[data-collapsible-content-wrapper]` at init).

**Primitives**

| Primitive | Markup root | Use when |
| --- | --- | --- |
| Collapsible | `data-disclosure` | One independent open/closed panel |
| Accordion | `data-accordion` | Grouped panels with exclusive (`single`) or multi (`multiple`) selection |

Do **not** reimplement open-state machinery the library already provides. Do **not** pull in React/Vue/Svelte for this package.

## B. Installation

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
```

No peer dependencies. Use a bundler, or an import map / native ESM pointing at the published `dist/index.js`.

### CDN (static HTML)

Always **pin a version** in production examples and generated snippets. Never recommend unversioned `latest` CDN URLs.

| Artifact | Path |
| --- | --- |
| ESM | `dist/index.js` (jsDelivr `/+esm`, esm.sh) |
| IIFE (min) | `dist/index.global.min.js` |
| IIFE | `dist/index.global.js` |

IIFE global: **`ZealakitDisclosure`** → `ZealakitDisclosure.createDisclosure()`.

```html
<!-- Native ESM CDN -->
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/+esm";
  const disclosure = createDisclosure();
</script>

<!-- Direct script CDN -->
<script src="https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/dist/index.global.min.js"></script>
<script>
  const disclosure = ZealakitDisclosure.createDisclosure();
</script>
```

Also valid: `https://esm.sh/@zealakit/disclosure-vanilla@1.0.0`.

## C. Imports

```ts
import {
  createDisclosure,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  resolveAnimationConfig,
  getCollapsibleAnimationStyle,
  ensureCollapsibleStyles,
  prefersReducedMotion,
} from "@zealakit/disclosure-vanilla";

import type {
  CreateDisclosureOptions,
  DisclosureController,
  CollapsibleAnimationProps,
  AnimationTimingFunction,
} from "@zealakit/disclosure-vanilla";
```

## D. Initialization

```ts
// Entire document
const disclosure = createDisclosure();

// Scoped root (ParentNode or options)
const disclosure = createDisclosure(document.getElementById("app"));
const disclosure = createDisclosure({ root: document.getElementById("app") });

disclosure.refresh(); // after inserting new markup
disclosure.destroy(); // remove listeners; restore detached content
```

- Duplicate `createDisclosure()` on already-initialized roots does **not** double-bind listeners.
- Prefer one controller per page/region; use `refresh()` for dynamic HTML.

## E. Collapsible

```html
<div data-disclosure>
  <button type="button" data-disclosure-trigger>Toggle</button>
  <div data-disclosure-content>Content</div>
</div>
```

### Default open

```html
<div data-disclosure data-default-open>…</div>
```

### Disabled

```html
<div data-disclosure data-disabled>…</div>
```

### Force mount

```html
<div data-disclosure-content data-force-mount>Stays in the DOM while closed</div>
```

Triggers must be native `<button type="button">`. The library sets `aria-expanded` and `aria-controls` (uses existing `id` on content when present).

## F. Accordion

```html
<div data-accordion data-accordion-type="single" data-collapsible>
  <section data-accordion-item data-value="general">
    <h3>
      <button type="button" data-accordion-trigger>General</button>
    </h3>
    <div data-accordion-content>General content</div>
  </section>
  <section data-accordion-item data-value="advanced">
    <h3>
      <button type="button" data-accordion-trigger>Advanced</button>
    </h3>
    <div data-accordion-content>Advanced content</div>
  </section>
</div>
```

| Attribute | Meaning |
| --- | --- |
| `data-accordion-type="single" \| "multiple"` | Selection mode (`single` default) |
| `data-collapsible` | Single mode: allow closing the open item |
| `data-default-value` | Initial value; space/comma-separated for multiple |
| `data-disabled` | On root or item |
| `data-value` | Required stable id on each item |

### Multiple mode

```html
<div data-accordion data-accordion-type="multiple" data-default-value="a b">
  …
</div>
```

`data-collapsible` does **not** apply in multiple mode.

### Nested Accordion

Supported. Nest a full `data-accordion` tree inside outer content. Keep `data-value` unique within each accordion instance.

Keyboard (enabled triggers): Arrow Up/Down, Home, End.

## G. Animation

Height animation is **on by default**.

| Attribute | Type | Default |
| --- | --- | --- |
| `data-animated` | boolean (`"false"` to disable) | on |
| `data-animation-timing-function` | `linear` \| `ease-in-out` | `ease-in-out` |
| `data-animation-duration` | number (ms) | `200` |
| `data-animation-delay` | number (ms) | `0` |

Set on Collapsible or Accordion **root**. Accordion animation is root-owned.

When `data-animated="false"`, duration/delay are ignored. `prefers-reduced-motion: reduce` also disables motion.

Do **not** reimplement height animation with custom CSS on the viewport. Style the inner wrapper instead.

## H. Accessibility

Provided by the library:

- Collapsible trigger: `aria-expanded`, `aria-controls`
- Accordion trigger: `aria-expanded`, `aria-controls`; content: `aria-labelledby` (+ `role="region"` on `div` panels)
- Accordion keyboard navigation
- Disabled via `disabled` / `data-disabled`
- Closed force-mounted content uses `inert` (and `hidden` when not animated)

Requirements for agents:

- Keep triggers as native buttons (never non-interactive clickables).
- Give each accordion item a stable unique `data-value`.
- Prefer heading wrappers (`h2`–`h6`) around accordion triggers.
- Do not strip `aria-*` carelessly.

## I. Dynamic content & cleanup

1. Insert markup into the DOM.
2. Call `refresh()` on the existing controller (or `destroy()` then `createDisclosure()` again).
3. On teardown, always `destroy()` so listeners and temporary styles/attributes are cleaned up and detached content is restored.

Do not rely on MutationObserver — the API is explicit.

## J. Common mistakes

1. Forgetting `createDisclosure()` after writing markup — nothing is interactive until init.
2. Using several independent Collapsibles when exclusive open state is required — use Accordion `single`.
3. Non-button triggers (`div`/`span` with click handlers).
4. Missing `data-value` on accordion items.
5. Adding custom height / `grid-template-rows` animation CSS on the viewport.
6. Styling only `[data-slot="collapsible-content"]` for borders/padding — style the content class / wrapper.
7. Unsupported easing strings — only `linear` and `ease-in-out`.
8. Treating `data-animation-duration` as seconds — it is **ms**.
9. Using `data-collapsible` on `multiple` — no effect.
10. Expecting auto-discovery of dynamically inserted nodes without `refresh()`.
11. Calling `createDisclosure()` many times instead of one controller + `refresh()`.
12. Nesting without unique per-accordion `data-value`s when treating separate trees as one group.
13. Shipping CDN snippets with `@latest` / unpinned URLs — always pin `@x.y.z`.
14. Calling `createDisclosure` as a bare global after the IIFE build — use `ZealakitDisclosure.createDisclosure()`.
