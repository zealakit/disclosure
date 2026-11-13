# Zealakit Collapsible

Headless Collapsible and Accordion primitives for **React**, **Vue**, and **Svelte**.

Inspired by the API design philosophy of [Base UI](https://base-ui.com/react/components/collapsible): compound composition, controlled/uncontrolled state, and accessibility first — without shipping colors, icons, or layout. Height expand/collapse animation is built in and enabled by default.

## Headless philosophy

These packages provide interaction behavior and accessibility only:

- No predefined styling
- No CSS dependencies
- No icons or visual layout
- No mandatory animations
- Style with your own CSS, Tailwind, CSS Modules, or design system

Use `data-slot` and `data-state` attributes as styling hooks.

## Packages

| Package | Framework |
| --- | --- |
| [`@zealakit/collapsible-react`](./packages/react) | React 18+ |
| [`@zealakit/collapsible-vue`](./packages/vue) | Vue 3.5+ |
| [`@zealakit/collapsible-svelte`](./packages/svelte) | Svelte 5 |

Each package is independently installable and publishable. There is no shared runtime package.

## Installation

```bash
# React
pnpm add @zealakit/collapsible-react

# Vue
pnpm add @zealakit/collapsible-vue

# Svelte
pnpm add @zealakit/collapsible-svelte
```

## Basic usage

### React

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-react";

export function Example() {
  return (
    <Collapsible defaultOpen={false}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

Disable animation with `animated={false}`. Customize timing via `--collapsible-animation-duration` and `--collapsible-animation-easing`.

Accordion (single / multiple) is exported from the same packages — see [docs](./docs/react.md).

### Vue

```vue
<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-vue";
</script>

<template>
  <Collapsible :default-open="false">
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/collapsible-svelte";
</script>

<Collapsible defaultOpen={false}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

## Documentation

- [React](./docs/react.md)
- [Vue](./docs/vue.md)
- [Svelte](./docs/svelte.md)
- Package READMEs under `packages/*`

## Examples

```bash
pnpm install
pnpm build

pnpm dev:react
pnpm dev:vue
pnpm dev:svelte
pnpm dev:nextjs
```

Examples live in `examples/react`, `examples/vue`, `examples/svelte`, and [`examples/nextjs`](./examples/nextjs).

### Next.js (App Router)

Install the React package, then mark interactive leaves with `"use client"`. The library does **not** ship a `"use client"` directive so your app owns the Server/Client boundary.

```tsx
// app/components/faq.tsx
"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-react";

export function Faq() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

```tsx
// app/page.tsx — Server Component
import { Faq } from "./components/faq";

export default function Page() {
  return (
    <main>
      <h1>FAQ</h1>
      <Faq />
    </main>
  );
}
```

Server Components can render static copy and import Client Components that contain Collapsible. Hooks and event handlers stay inside the Client Component tree.

## Development

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## License

MIT © Zealakit
