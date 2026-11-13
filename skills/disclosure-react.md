# Disclosure React Skill

Practical instructions for AI coding agents using `@zealakit/disclosure-react`.

## A. Overview

Disclosure provides **headless** Collapsible and Accordion primitives for React 18+.

- State, composition, accessibility, and built-in height animation are included.
- Visual styling is owned by the consumer (`className`, CSS via `data-slot` / `data-state`).
- Put padding, borders, and backgrounds on `CollapsibleContent` / `AccordionContent` (they land on `[data-collapsible-content-wrapper]`).

**Primitives**

| Primitive | Use when |
| --- | --- |
| `Collapsible` | One independent open/closed panel |
| `Accordion` | Grouped panels with exclusive (`single`) or multi (`multiple`) selection |

Do **not** reimplement open-state machinery the library already provides.

## B. Installation

```bash
npm i @zealakit/disclosure-react
```

Peer dependencies: `react`, `react-dom` (≥ 18).

## C. Imports

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useCollapsibleContext,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
} from "@zealakit/disclosure-react";

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
  CollapsibleAnimationProps,
  AnimationTimingFunction,
} from "@zealakit/disclosure-react";
```

## D. Collapsible

Compose `Collapsible` → `CollapsibleTrigger` → `CollapsibleContent`.

### Uncontrolled

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-react";

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

### Default open

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Starts open</CollapsibleContent>
</Collapsible>
```

### Controlled

```tsx
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-react";

export function Controlled() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

Use either controlled (`open` + `onOpenChange`) **or** uncontrolled (`defaultOpen`). Do not fight both at once without a clear owner.

### Disabled

```tsx
<Collapsible disabled>
  <CollapsibleTrigger>Disabled</CollapsibleTrigger>
  <CollapsibleContent>Unreachable via click</CollapsibleContent>
</Collapsible>
```

### Force mount

```tsx
<CollapsibleContent forceMount>
  Stays in the DOM while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## E. Accordion

Compose `Accordion` → `AccordionItem` → `AccordionTrigger` + `AccordionContent`. Every item needs a stable `value` string.

### Single mode (default `type="single"`)

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/disclosure-react";

export function Faq() {
  return (
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
  );
}
```

- `collapsible` (default `false`): in single mode, allow closing the open item.
- Without `collapsible`, one item stays open once selected.

### Multiple mode

```tsx
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

### Controlled

```tsx
const [value, setValue] = useState<string | null>(null);

<Accordion type="single" collapsible value={value} onValueChange={setValue}>
  {/* items */}
</Accordion>
```

```tsx
const [value, setValue] = useState<string[]>([]);

<Accordion type="multiple" value={value} onValueChange={setValue}>
  {/* items */}
</Accordion>
```

### Uncontrolled

- Single: `defaultValue?: string | null` (default `null`)
- Multiple: `defaultValue?: string[]` (default `[]`)

### Disabled items / root

```tsx
<Accordion disabled>{/* all interaction off */}</Accordion>

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

Set on `Collapsible` or `Accordion` root. Accordion animation is root-owned (no per-item overrides).

```tsx
<Collapsible
  animationTimingFunction="linear"
  animationDuration={300}
  animationDelay={50}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```tsx
<Collapsible animated={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

When `animated={false}`, duration/delay are ignored. `prefers-reduced-motion: reduce` also disables motion.

Do **not** reimplement height animation with custom CSS on the viewport. Style the inner wrapper instead.

Exported defaults: `DEFAULT_ANIMATION_DURATION_MS`, `DEFAULT_ANIMATION_DELAY_MS`, `DEFAULT_ANIMATION_TIMING_FUNCTION`.

## G. Framework-specific integration

### Composition

Always use the compound components. Triggers render native `<button type="button">`. Accordion content is a `<section>` with `aria-labelledby`.

### Controlled state

- Collapsible: `open` + `onOpenChange`
- Accordion: `value` + `onValueChange` (type depends on `type`)

### TypeScript

Prefer exported prop types (`CollapsibleProps`, `AccordionSingleProps`, `AccordionMultipleProps`, …). `AccordionProps` is a discriminated union on `type`.

### Next.js App Router / RSC

The package does **not** ship `"use client"`.

1. Put interactive Disclosure usage in a **client** leaf component.
2. Add `"use client"` at the top of **that** file.
3. Import Disclosure only from client modules — do not call hooks/stateful Disclosure APIs inside Server Components.

```tsx
// app/components/faq.tsx
"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-react";

export function Faq() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

Server Components may **import and render** the client leaf, but must not own the interactive tree themselves.

## H. Accessibility

Provided by the library:

- Collapsible trigger: `aria-expanded`, `aria-controls`
- Accordion trigger: `aria-expanded`, `aria-controls`; content: `aria-labelledby`
- Accordion keyboard: Arrow Up/Down, Home, End (enabled triggers only)
- Disabled state via `disabled` / `data-disabled`
- Closed force-mounted content uses `inert` (and `hidden` when not animated)

Requirements for agents:

- Keep triggers as the library buttons (do not replace with non-button clickables).
- Give each `AccordionItem` a stable unique `value`.
- Do not strip `aria-*` by overriding carelessly.

## I. Common mistakes

1. Using several independent `Collapsible`s when exclusive open state is required — use `Accordion type="single"` instead.
2. Reimplementing open state with extra React state while also passing `defaultOpen` only — pick controlled or uncontrolled.
3. Adding custom height/`grid-template-rows` animation CSS — the library already animates.
4. Styling only `[data-slot="collapsible-content"]` for borders/padding — style Content `className` / the wrapper.
5. Passing unsupported easing strings — only `"linear"` and `"ease-in-out"`.
6. Treating `animationDuration` as seconds — it is **ms**.
7. Forgetting `"use client"` on Next.js App Router leaves that use Disclosure.
8. Adding `"use client"` inside the library package (not needed / not present).
9. Using `collapsible` on `type="multiple"` — it has no effect.
10. Nesting without unique per-accordion item values when values collide across instances you treat as one group.
