# Disclosure Vue Skill

Practical instructions for AI coding agents using `@zealakit/disclosure-vue`.

## A. Overview

Disclosure provides **headless** Collapsible and Accordion primitives for Vue 3.5+.

- State, composition, accessibility, and built-in height animation are included.
- Visual styling is owned by the consumer (`class`, CSS via `data-slot` / `data-state`).
- Put padding, borders, and backgrounds on `CollapsibleContent` / `AccordionContent` (they land on `[data-collapsible-content-wrapper]`).

**Primitives**

| Primitive | Use when |
| --- | --- |
| `Collapsible` | One independent open/closed panel |
| `Accordion` | Grouped panels with exclusive (`single`) or multi (`multiple`) selection |

Prefer Vue template composition and `v-model:*` — do not invent React-style prop patterns.

## B. Installation

```bash
npm i @zealakit/disclosure-vue
```

Peer dependency: `vue` (^3.5.0).

## C. Imports

```ts
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  CollapsibleContextKey,
  AccordionContextKey,
  AccordionItemContextKey,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
} from "@zealakit/disclosure-vue";

import type {
  CollapsibleProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
  CollapsibleContextValue,
  AccordionProps,
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionContextValue,
  AccordionItemContextValue,
  CollapsibleAnimationProps,
  AnimationTimingFunction,
} from "@zealakit/disclosure-vue";
```

## D. Collapsible

Compose `Collapsible` → `CollapsibleTrigger` → `CollapsibleContent`.

### Uncontrolled

```vue
<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-vue";
</script>

<template>
  <Collapsible>
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

### Default open

```vue
<Collapsible :default-open="true">
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Starts open</CollapsibleContent>
</Collapsible>
```

### Controlled (`v-model:open`)

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-vue";

const open = ref(false);
</script>

<template>
  <Collapsible v-model:open="open">
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

Emits: `update:open`, `openChange` (both `(open: boolean)`). Prefer `v-model:open` in templates.

### Disabled

```vue
<Collapsible disabled>
  <CollapsibleTrigger>Disabled</CollapsibleTrigger>
  <CollapsibleContent>Unreachable via click</CollapsibleContent>
</Collapsible>
```

### Force mount

```vue
<CollapsibleContent force-mount>
  Stays in the DOM while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

In templates, boolean props commonly use kebab-case (`force-mount`, `default-open`).

## E. Accordion

Compose `Accordion` → `AccordionItem` → `AccordionTrigger` + `AccordionContent`. Every item needs a stable `value` string.

### Single mode (default `type="single"`)

```vue
<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/disclosure-vue";
</script>

<template>
  <Accordion type="single" collapsible>
    <AccordionItem value="general">
      <AccordionTrigger>General</AccordionTrigger>
      <AccordionContent>General content</AccordionContent>
    </AccordionItem>
    <AccordionItem value="advanced">
      <AccordionTrigger>Advanced</AccordionTrigger>
      <AccordionContent>Advanced content</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

- `collapsible` (default `false`): allow closing the open item in single mode.
- Without `collapsible`, one item stays open once selected.

### Multiple mode

```vue
<Accordion type="multiple" :default-value="['general']">
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
```

`collapsible` does **not** apply in multiple mode.

### Controlled (`v-model:value`)

```vue
<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>(null);
</script>

<template>
  <Accordion type="single" collapsible v-model:value="value">
    <!-- items -->
  </Accordion>
</template>
```

```vue
<script setup lang="ts">
import { ref } from "vue";

const value = ref<string[]>([]);
</script>

<template>
  <Accordion type="multiple" v-model:value="value">
    <!-- items -->
  </Accordion>
</template>
```

Emits: `update:value`, `valueChange`.

### Uncontrolled

- Single: `defaultValue` / `:default-value` (`string | null`, default `null`)
- Multiple: `defaultValue` / `:default-value` (`string[]`, default `[]`)

### Disabled items / root

```vue
<Accordion disabled><!-- all interaction off --></Accordion>

<AccordionItem value="billing" disabled>
  <AccordionTrigger>Billing</AccordionTrigger>
  <AccordionContent>…</AccordionContent>
</AccordionItem>
```

### Nested Accordion

Supported. Nest a full `Accordion` inside an outer `AccordionContent`. Keep item `value`s unique within each accordion instance.

## F. Animation

Height animation is **on by default** (`animated` defaults to `true`).

| Prop | Type | Default | Unit / notes |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | Built-in grid height transition |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Template: `animation-timing-function` |
| `animationDuration` | `number` | `200` | **milliseconds** (`:animation-duration`) |
| `animationDelay` | `number` | `0` | **milliseconds** (`:animation-delay`) |

Set on `Collapsible` or `Accordion` root. Accordion animation is root-owned.

```vue
<Collapsible
  animation-timing-function="linear"
  :animation-duration="300"
  :animation-delay="50"
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```vue
<Collapsible :animated="false">
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

When `animated` is `false`, duration/delay are ignored. `prefers-reduced-motion` also disables motion.

Do **not** reimplement height animation with custom CSS on the viewport.

Exported defaults: `DEFAULT_ANIMATION_DURATION_MS`, `DEFAULT_ANIMATION_DELAY_MS`, `DEFAULT_ANIMATION_TIMING_FUNCTION`.

## G. Framework-specific integration

### Composition API

Use `<script setup lang="ts">` + template slots/children. Parts communicate via Vue `provide`/`inject` (keys exported: `CollapsibleContextKey`, `AccordionContextKey`, `AccordionItemContextKey`).

### Model conventions

| Component | Prefer |
| --- | --- |
| Collapsible | `v-model:open` |
| Accordion | `v-model:value` |

Also listen with `@open-change` / `@value-change` if needed (`openChange` / `valueChange` emits).

### Controlled vs uncontrolled

- Uncontrolled: `default-open` / `default-value`
- Controlled: bind `open` / `value` via `v-model:*` (or `:open` + `@update:open`)

### TypeScript

Import prop types from `@zealakit/disclosure-vue`. `AccordionProps` is a union on `type`.

Do **not** apply React `useState` / `onOpenChange` naming in Vue templates — use Vue models and emits.

## H. Accessibility

Provided by the library:

- Collapsible trigger: `aria-expanded`, `aria-controls`
- Accordion trigger: `aria-expanded`, `aria-controls`; content: `aria-labelledby`
- Accordion keyboard: Arrow Up/Down, Home, End
- Disabled via `disabled` / `data-disabled`
- Closed force-mounted content uses `inert` (and `hidden` when not animated)

Keep library triggers as buttons; give each `AccordionItem` a stable unique `value`.

## I. Common mistakes

1. Using several `Collapsible`s when exclusive open state is required — use `Accordion type="single"`.
2. Using React-style `open` + `onOpenChange` only — prefer `v-model:open`.
3. Forgetting kebab-case in templates (`animation-duration`, `force-mount`, `default-value`).
4. Reimplementing height animation in CSS.
5. Styling only the content viewport for borders/padding — style Content `class` / the wrapper.
6. Unsupported easing strings — only `"linear"` and `"ease-in-out"`.
7. Treating duration/delay as seconds — values are **ms**.
8. Using `collapsible` on `type="multiple"` — no effect.
9. Mixing controlled `value` without listening to `update:value` / `v-model:value`.
