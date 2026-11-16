# @zealakit/disclosure-react

[English](https://github.com/zealakit/disclosure/blob/main/packages/react/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/react/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/react/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Headless Collapsible and Accordion for React. Provides state, composition, accessibility, and a built-in height animation. You own visual styling.

Apply padding, borders, and backgrounds via `className` on `CollapsibleContent` / `AccordionContent` (or `[data-collapsible-content-wrapper]`). Those styles land on the clipped content panel so exit animations collapse cleanly.

> **Note**
>
> Disclosure is not a replacement for a full UI library. Use it when Accordion or Collapsible in your kit is hard to restyle — or when you only need that one primitive and don’t want to pull in a large design system.

## Install

```bash
npm i @zealakit/disclosure-react
# or: pnpm add / yarn add / bun add
```

Peer dependencies: `react`, `react-dom` (≥ 18).

## Collapsible

### Quick start

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

### `Collapsible` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state should change |
| `disabled` | `boolean` | `false` | Disables the whole collapsible |
| `animation` | `boolean \| AnimationConfig` | `true` | Height expand/collapse animation. `false` turns it off; pass an object to customise it |
| `children` | `ReactNode` | — | Compound parts (`Trigger`, `Content`, …) |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the root element |

Root attributes: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` when disabled.

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Disables this trigger |
| `children` | `ReactNode` | — | Trigger label / content |
| `...button props` | `ButtonHTMLAttributes` | — | Forwarded to the native `<button>` |

Sets `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"`, and `data-state`.

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content in the DOM while closed |
| `children` | `ReactNode` | — | Panel body |
| `className` / `style` | — | — | Applied to the **inner** content wrapper (clipped during animation) |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the inner wrapper |

The animated viewport owns height + clipping. Put borders/padding on `className` / the wrapper, not on the viewport via `[data-slot="collapsible-content"]` alone.

### Controlled usage

```tsx
const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Animation configuration

```tsx
<Collapsible
  animation={{ duration: 300, delay: 50, easing: "linear" }}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```tsx
<Collapsible animation={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` with a config | Set `false` to turn the animation off. |
| `duration` | `number` | `200` | Milliseconds. |
| `delay` | `number` | `0` | Milliseconds. |
| `easing` | `string` | `"ease-in-out"` | `ease-in-out`, `linear`, or any CSS timing function. |
| `...` | — | — | Pass `true` for the defaults or `false` to disable. |

Animation is **on by default** (Overlay: off), the default duration is 200ms (Overlay: 160ms), and there is no `type` / `direction`: Disclosure has one built-in height transition. When both are passed, `animation` wins and the deprecated props are ignored.

When animation is off, open/close updates immediately and duration/delay are ignored. `prefers-reduced-motion: reduce` also disables motion.

| Deprecated (works until 2.0.0, warns once in development) | Use |
| --- | --- |
| `animated={false}` | `animation={false}` |
| `animationDuration={320}` | `animation={{ duration: 320 }}` |
| `animationDelay={120}` | `animation={{ delay: 120 }}` |
| `animationTimingFunction="linear"` | `animation={{ easing: "linear" }}` |

CSS variables set on the content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```tsx
<CollapsibleContent forceMount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### Quick start

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/disclosure-react";

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

### `Accordion` props (shared)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Selection mode |
| `animation` | `boolean \| AnimationConfig` | `true` | Height animation for item panels (shared by all items). `false` turns it off; pass an object to customise it |
| `disabled` | `boolean` | `false` | Disables the whole accordion |
| `children` | `ReactNode` | — | `AccordionItem` children |
| `...div props` | — | — | Forwarded to the root element |

Animation props are owned by the Accordion root and inherited by every item. There are no per-item animation overrides.

### `Accordion` props (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Controlled open item |
| `defaultValue` | `string \| null` | `null` | Uncontrolled initial item |
| `collapsible` | `boolean` | `false` | Allow closing the open item |
| `onValueChange` | `(value: string \| null) => void` | — | Value change callback |

### `Accordion` props (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Controlled open items |
| `defaultValue` | `string[]` | `[]` | Uncontrolled initial items |
| `onValueChange` | `(value: string[]) => void` | — | Value change callback |

`collapsible` does not apply in multiple mode.

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | Stable item id |
| `disabled` | `boolean` | `false` | Disables this item |
| `children` | `ReactNode` | — | Trigger + content |
| `...div props` | — | — | Forwarded to the item root |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Disables this trigger |
| `children` | `ReactNode` | — | Trigger label |
| `...button props` | — | — | Forwarded to the native `<button>` |

Keyboard: Arrow Up/Down, Home, End.

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content mounted while closed |
| `children` | `ReactNode` | — | Panel body |
| `className` / `style` | — | — | Applied to the inner clipped wrapper |
| `...section props` | — | — | Forwarded to the inner wrapper |

### Multiple mode example

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

### Accordion with custom animation

```tsx
<Accordion
  type="single"
  collapsible
  animation={{ duration: 300, easing: "ease-in-out", delay: 0 }}
>
  ...
</Accordion>
```

## Styling hooks

| Attribute | Where | Purpose |
| --- | --- | --- |
| `data-slot` | root / trigger / content | Target parts in CSS |
| `data-state` | `"open" \| "closed"` | Open/closed styling |
| `data-disabled` | when disabled | Disabled styling |
| `data-collapsible-content-wrapper` | inner panel | Borders, padding, backgrounds |
| `data-animated` | content viewport | Present when height animation is active |

## Next.js App Router

This package does **not** ship with `"use client"`. In the Next.js App Router, add `"use client"` at the top of your component file — for example:

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

## AI Agent Skill

Practical React usage for AI coding agents: [disclosure-react skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-react.md).

## License

MIT © Zealakit
