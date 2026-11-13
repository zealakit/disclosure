# @zealakit/disclosure-vanilla

[English](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Headless Collapsible and Accordion for vanilla JavaScript and static HTML. Provides state, accessibility, and a built-in height animation — no React, Vue, or Svelte required. You own visual styling.

Author semantic HTML with `data-*` attributes, then call `createDisclosure()` once. Put padding, borders, and backgrounds on the content element’s class (moved onto `[data-collapsible-content-wrapper]` at init) so exit animations collapse cleanly.

> **Note**
>
> Disclosure is not a replacement for a full UI library. Use it when Accordion or Collapsible in your kit is hard to restyle — or when you only need that one primitive and don’t want to pull in a large design system.

## Install

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
# or: pnpm add / yarn add / bun add
```

No peer dependencies. Works with a bundler (Vite, esbuild, …) or a browser import map pointing at the ESM build.

### CDN (static HTML)

Pin a published version in production. Do **not** use unversioned `latest` CDN URLs.

Published browser artifacts:

| File | Use |
| --- | --- |
| `dist/index.js` | ESM (bundlers, import maps, jsDelivr `/+esm`, esm.sh) |
| `dist/index.d.ts` | TypeScript declarations |
| `dist/index.global.js` | IIFE script tag (readable) |
| `dist/index.global.min.js` | IIFE script tag (minified, preferred for CDN) |

Global namespace for the IIFE build: **`ZealakitDisclosure`**.

#### 1. Native ESM CDN

```html
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/+esm";

  const disclosure = createDisclosure();
</script>
```

Also works with esm.sh:

```html
<script type="module">
  import { createDisclosure } from "https://esm.sh/@zealakit/disclosure-vanilla@1.0.0";

  const disclosure = createDisclosure();
</script>
```

#### 2. Direct script CDN (IIFE)

```html
<script src="https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/dist/index.global.min.js"></script>
<script>
  const disclosure = ZealakitDisclosure.createDisclosure();
</script>
```

Unminified IIFE (debugging): `…/dist/index.global.js`.

## Quick start

```html
<div data-disclosure>
  <button type="button" data-disclosure-trigger aria-expanded="false">
    Toggle content
  </button>
  <div id="content-1" data-disclosure-content hidden>
    Content
  </div>
</div>

<script type="module">
  import { createDisclosure } from "@zealakit/disclosure-vanilla";
  const disclosure = createDisclosure();
  // disclosure.refresh() after inserting new markup
  // disclosure.destroy() when tearing down
</script>
```

## Public API

| Export | Description |
| --- | --- |
| `createDisclosure(root?)` | Initialize all `[data-disclosure]` / `[data-accordion]` under `document` or a root node |
| `createDisclosure({ root })` | Same, options object form |
| `DisclosureController.destroy()` | Remove listeners and restore content nodes |
| `DisclosureController.refresh()` | Destroy + re-scan (for dynamically inserted markup) |
| `DEFAULT_ANIMATION_*` | Same animation defaults as framework packages |
| `resolveAnimationConfig` / `getCollapsibleAnimationStyle` | Shared animation helpers |

## Collapsible markup

| Attribute | On | Description |
| --- | --- | --- |
| `data-disclosure` | root | Marks a Collapsible root |
| `data-disclosure-trigger` | `<button type="button">` | Toggle control |
| `data-disclosure-content` | content region | Panel body |
| `data-default-open` | root | Start expanded (`false` by default) |
| `data-disabled` | root | Disable interaction |
| `data-force-mount` | content | Keep content in the DOM while closed |
| `data-animated` | root | `"false"` disables height animation (default on) |
| `data-animation-timing-function` | root | `linear` \| `ease-in-out` (default `ease-in-out`) |
| `data-animation-duration` | root | Duration ms (default `200`) |
| `data-animation-delay` | root | Delay ms (default `0`) |

Root attributes after init: `data-slot="collapsible"`, `data-state="open" \| "closed"`, `data-disabled` when disabled. Triggers get `aria-expanded` / `aria-controls`.

## Accordion markup

```html
<div data-accordion data-accordion-type="single" data-collapsible>
  <section data-accordion-item data-value="item-1">
    <h3>
      <button type="button" data-accordion-trigger>
        First item
      </button>
    </h3>
    <div id="accordion-content-1" data-accordion-content hidden>
      First content
    </div>
  </section>
</div>
```

| Attribute | On | Description |
| --- | --- | --- |
| `data-accordion` | root | Marks an Accordion root |
| `data-accordion-type` | root | `single` (default) \| `multiple` |
| `data-collapsible` | root | Allow closing the open item in single mode |
| `data-default-value` | root | Initial value(s); space/comma-separated for `multiple` |
| `data-disabled` | root or item | Disable root or a single item |
| `data-accordion-item` + `data-value` | item | Stable item id |
| `data-accordion-trigger` | `<button>` | Item trigger (prefer inside `h2`–`h6`) |
| `data-accordion-content` | panel | Item content region |
| Animation attrs | root | Same as Collapsible |

Keyboard (enabled triggers): `ArrowDown` / `ArrowUp` / `Home` / `End`. Nested accordions are independent.

## Animation

Height animation uses CSS `grid-template-rows` (`minmax(0, 0fr)` ↔ `minmax(0, 1fr)`), enabled by default. `prefers-reduced-motion: reduce` disables motion. Content stays mounted through the exit transition, then detaches unless `data-force-mount` is set.

CSS variables on the content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

## Styling

Headless — no themes or icons. Style via your CSS and:

- `data-slot` — `collapsible`, `collapsible-trigger`, `collapsible-content`, `accordion`, `accordion-item`, `accordion-heading`, `accordion-trigger`, `accordion-content`
- `data-state` — `open` \| `closed`
- `data-disabled`

Put chrome on the content element’s class/style (applied to `[data-collapsible-content-wrapper]`).

## Lifecycle

```ts
const disclosure = createDisclosure(document.getElementById("app"));

// After dynamically inserting markup:
disclosure.refresh();

// On page teardown / SPA unmount:
disclosure.destroy();
```

Calling `createDisclosure()` twice on the same roots does not register duplicate listeners. Use `refresh()` or `destroy()` + `createDisclosure()` when markup changes.

## Agent skill

Practical agent instructions: [skills/disclosure-vanilla.md](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vanilla.md)

## License

MIT © Zealakit
