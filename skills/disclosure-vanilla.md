# Disclosure for Vanilla JS

Practical instructions for AI coding agents using `@zealakit/disclosure-vanilla`.

## Install

Disclosure provides **headless** Collapsible and Accordion primitives for vanilla JavaScript and static HTML.

- Declarative HTML via `data-*` attributes + a small `createDisclosure()` initializer.
- State, accessibility, and built-in height animation are included.

**Primitives**

| Primitive | Markup root | Use when |
| --- | --- | --- |
| Collapsible | `data-disclosure` | One independent open/closed panel |
| Accordion | `data-accordion` | Grouped panels with exclusive (`single`) or multi (`multiple`) selection |

Do **not** reimplement open-state machinery the library already provides. Do **not** pull in React/Vue/Svelte for this package.

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
```

No peer dependencies. Use a bundler, or an import map / native ESM pointing at the published `dist/index.js`.

### CDN (static HTML)

Always **pin a version** in production examples and generated snippets. Never recommend unversioned `latest` CDN URLs.

| Artifact | Path |
| --- | --- |
| ESM only | `dist/index.js` (jsDelivr `/+esm`, esm.sh) |

The 1.x IIFE build and `ZealakitDisclosure` global were removed in 2.0.0.

```html
<!-- Native ESM CDN -->
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@2.0.0/+esm";
  const disclosure = createDisclosure();
</script>
```

Also valid: `https://esm.sh/@zealakit/disclosure-vanilla@2.0.0`.

## Import

```ts
import {
  createDisclosure,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_DELAY,
  DEFAULT_ANIMATION_EASING,
  normalizeAnimationConfig,
  getAnimationStyle,
  ensureCollapsibleStyles,
  prefersReducedMotion,
} from "@zealakit/disclosure-vanilla";

import type {
  CreateDisclosureOptions,
  DisclosureController,
  AnimationConfig,
  AnimationSetting,
  AnimationTimingFunction,
} from "@zealakit/disclosure-vanilla";
```

## Rules

Avoid these mistakes:

1. Forgetting `createDisclosure()` after writing markup — nothing is interactive until init.
2. Using several independent Collapsibles when exclusive open state is required — use Accordion `single`.
3. Non-button triggers (`div`/`span` with click handlers).
4. Missing `data-value` on accordion items.
5. Adding custom height / `grid-template-rows` animation CSS on the viewport.
6. Styling only `[data-slot="collapsible-content"]` for borders/padding — style the content class / wrapper.
7. Passing an invalid `easing` — use `ease-in-out`, `linear`, or any valid CSS timing function.
8. Treating `data-animation-duration` as seconds — it is **ms**.
9. Using `data-collapsible` on `multiple` — no effect.
10. Expecting auto-discovery of dynamically inserted nodes without `refresh()`.
11. Calling `createDisclosure()` many times instead of one controller + `refresh()`.
12. Nesting without unique per-accordion `data-value`s when treating separate trees as one group.
13. Shipping CDN snippets with `@latest` / unpinned URLs — always pin `@x.y.z`.
14. Using the removed 1.x IIFE global (`ZealakitDisclosure.createDisclosure()`) — import `createDisclosure` from the ESM build instead.

## Initialization

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

## Collapsible

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

## Accordion

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

## Animation

Height animation is **on by default**.

| Attribute | Type | Default |
| --- | --- | --- |
| `data-animation` | `"false"` disables; `""` / `"true"` enable | on |
| `data-animation-duration` | number (ms) | `200` |
| `data-animation-delay` | number (ms) | `0` |
| `data-animation-easing` | `ease-in-out`, `linear`, or any CSS timing function | `ease-in-out` |

Set on Collapsible or Accordion **root**. Accordion animation is root-owned.

When `data-animation="false"`, duration/delay are ignored. `prefers-reduced-motion: reduce` also disables motion.

Do **not** reimplement height animation with custom CSS on the viewport. Style the inner wrapper instead.

## Lifecycle

1. Insert markup into the DOM.
2. Call `refresh()` on the existing controller (or `destroy()` then `createDisclosure()` again).
3. On teardown, always `destroy()` so listeners and temporary styles/attributes are cleaned up and detached content is restored.

Do not rely on MutationObserver — the API is explicit.

## Styling

- Visual styling is owned by the consumer (CSS via `data-slot` / `data-state`).
- Put padding, borders, and backgrounds on the content element’s class/style (moved to `[data-collapsible-content-wrapper]` at init).

## Verify

Check the rendered DOM for:

- [ ] Collapsible trigger: `aria-expanded`, `aria-controls`
- [ ] Accordion trigger: `aria-expanded`, `aria-controls`; content: `aria-labelledby` (+ `role="region"` on `div` panels)
- [ ] Accordion keyboard navigation
- [ ] Disabled via `disabled` / `data-disabled`
- [ ] Closed force-mounted content uses `inert` (and `hidden` when not animated)

Before finishing:

- [ ] Keep triggers as native buttons (never non-interactive clickables).
- [ ] Give each accordion item a stable unique `data-value`.
- [ ] Prefer heading wrappers (`h2`–`h6`) around accordion triggers.
- [ ] Do not strip `aria-*` carelessly.

## Full API

Props, events, and options: [packages/vanilla/README.md](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md).
