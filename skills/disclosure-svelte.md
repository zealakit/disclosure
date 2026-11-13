# Disclosure Svelte Skill

Practical instructions for AI coding agents using `@zealakit/disclosure-svelte`.

## A. Overview

Disclosure provides **headless** Collapsible and Accordion primitives for **Svelte 5**.

- State, composition, accessibility, and built-in height animation are included.
- Visual styling is owned by the consumer (`class`, CSS via `data-slot` / `data-state`).
- Put padding, borders, and backgrounds on `CollapsibleContent` / `AccordionContent` (they land on `[data-collapsible-content-wrapper]`).

**Primitives**

| Primitive | Use when |
| --- | --- |
| `Collapsible` | One independent open/closed panel |
| `Accordion` | Grouped panels with exclusive (`single`) or multi (`multiple`) selection |

Use Svelte 5 runes (`$state`, `$bindable`) and `bind:` — do not apply React or Vue conventions.

## B. Installation

```bash
npm i @zealakit/disclosure-svelte
```

Peer dependency: `svelte` (^5.0.0).

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
  getCollapsibleContext,
  setCollapsibleContext,
  getAccordionContext,
  setAccordionContext,
  getAccordionItemContext,
  setAccordionItemContext,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
} from "@zealakit/disclosure-svelte";

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
} from "@zealakit/disclosure-svelte";
```

## D. Collapsible

Compose `Collapsible` → `CollapsibleTrigger` → `CollapsibleContent`.

### Uncontrolled

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/disclosure-svelte";
</script>

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Default open

```svelte
<Collapsible defaultOpen>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Starts open</CollapsibleContent>
</Collapsible>
```

### Controlled (`bind:open`)

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/disclosure-svelte";

  let open = $state(false);
</script>

<Collapsible bind:open>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

You can also pass `open` + `onOpenChange` without `bind:` when the parent fully owns updates.

### Disabled

```svelte
<Collapsible disabled>
  <CollapsibleTrigger>Disabled</CollapsibleTrigger>
  <CollapsibleContent>Unreachable via click</CollapsibleContent>
</Collapsible>
```

### Force mount

```svelte
<CollapsibleContent forceMount>
  Stays in the DOM while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## E. Accordion

Compose `Accordion` → `AccordionItem` → `AccordionTrigger` + `AccordionContent`. Every item needs a stable `value` string.

### Single mode (default `type="single"`)

```svelte
<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from "@zealakit/disclosure-svelte";
</script>

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
```

- `collapsible` (default `false`): allow closing the open item in single mode.
- Without `collapsible`, one item stays open once selected.

### Multiple mode

```svelte
<Accordion type="multiple" defaultValue={["general"]}>
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

### Controlled (`bind:value`)

```svelte
<script lang="ts">
  let value = $state<string | null>(null);
</script>

<Accordion type="single" collapsible bind:value>
  <!-- items -->
</Accordion>
```

```svelte
<script lang="ts">
  let value = $state<string[]>([]);
</script>

<Accordion type="multiple" bind:value>
  <!-- items -->
</Accordion>
```

Optional callback: `onValueChange`.

### Uncontrolled

- Single: `defaultValue?: string | null` (default `null`)
- Multiple: `defaultValue?: string[]` (default `[]`)

### Disabled items / root

```svelte
<Accordion disabled><!-- all interaction off --></Accordion>

<AccordionItem value="billing" disabled>
  <AccordionTrigger>Billing</AccordionTrigger>
  <AccordionContent>…</AccordionContent>
</AccordionItem>
```

### Nested Accordion

Supported. Nest a full `Accordion` inside an outer `AccordionContent`. Keep item `value`s unique within each accordion instance.

## F. Animation

Height animation is **on by default** (`animated={true}`).

| Prop | Type | Default | Unit / notes |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | Built-in grid height transition |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Only these two values |
| `animationDuration` | `number` | `200` | **milliseconds** |
| `animationDelay` | `number` | `0` | **milliseconds** |

Set on `Collapsible` or `Accordion` root. Accordion animation is root-owned.

```svelte
<Collapsible
  animationTimingFunction="linear"
  animationDuration={300}
  animationDelay={50}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```svelte
<Collapsible animated={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

When `animated={false}`, duration/delay are ignored. `prefers-reduced-motion` also disables motion.

Do **not** reimplement height animation with custom CSS on the viewport.

Exported defaults: `DEFAULT_ANIMATION_DURATION_MS`, `DEFAULT_ANIMATION_DELAY_MS`, `DEFAULT_ANIMATION_TIMING_FUNCTION`.

## G. Framework-specific integration

### Svelte 5

- Peer: `svelte` ^5
- Prefer runes: `let open = $state(false)`
- Two-way: `bind:open`, `bind:value` (props are `$bindable` in the components)

### Composition

Snippet/children composition via nested components. Context helpers (`getCollapsibleContext`, `getAccordionContext`, …) exist for advanced extensions — normal apps should use the public components only.

### Controlled vs uncontrolled

| Mode | Collapsible | Accordion |
| --- | --- | --- |
| Uncontrolled | `defaultOpen` | `defaultValue` |
| Controlled | `bind:open` or `open` + `onOpenChange` | `bind:value` or `value` + `onValueChange` |

### TypeScript

Use `<script lang="ts">` and exported prop types. Do not invent Vue `v-model` or React hooks APIs in Svelte files.

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
2. Writing Svelte 4 `export let open` patterns — this package targets Svelte 5 (`$state`, `bind:`).
3. Applying Vue `v-model:open` or React `useState` idioms in `.svelte` files.
4. Reimplementing height animation in CSS.
5. Styling only the content viewport for borders/padding — style Content `class` / the wrapper.
6. Unsupported easing strings — only `"linear"` and `"ease-in-out"`.
7. Treating duration/delay as seconds — values are **ms**.
8. Using `collapsible` on `type="multiple"` — no effect.
9. Binding `value` with the wrong type (`string` vs `string[]`) for the Accordion `type`.
