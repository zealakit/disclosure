# @zealakit/disclosure-svelte

[English](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Headless Collapsible and Accordion for Svelte 5. Built-in height animation is enabled by default. You own visual styling.

Apply padding, borders, and backgrounds via `class` on `CollapsibleContent` / `AccordionContent` (or `[data-collapsible-content-wrapper]`). Those styles land on the clipped content panel so exit animations collapse cleanly.

> **Note**
>
> Disclosure is not a replacement for a full UI library. Use it when Accordion or Collapsible in your kit is hard to restyle — or when you only need that one primitive and don’t want to pull in a large design system.

## Install

```bash
npm i @zealakit/disclosure-svelte
# or: pnpm add / yarn add / bun add
```

Peer dependency: `svelte` (^5).

## Collapsible

### Quick start

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

### `Collapsible` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled |
| `open` | `boolean` | — | Controlled open state (`bind:open`) |
| `onOpenChange` | `(open: boolean) => void` | — | Called when open state should change |
| `disabled` | `boolean` | `false` | Disables the whole collapsible |
| `animated` | `boolean` | `true` | Enables height expand/collapse animation |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Transition easing |
| `animationDuration` | `number` | `200` | Duration in milliseconds |
| `animationDelay` | `number` | `0` | Delay in milliseconds |
| `class` / other attrs | — | — | Forwarded to the root element |

Root attributes: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` when disabled.

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Disables this trigger |
| `class` / other attrs | — | — | Forwarded to the native `<button>` |

Sets `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"`, and `data-state`.

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content in the DOM while closed |
| `class` / `style` | — | — | Applied to the **inner** content wrapper (clipped during animation) |
| other attrs | — | — | Forwarded to the inner wrapper |

Put borders/padding on the content wrapper, not only on the animated viewport.

### Controlled usage

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

### Animation configuration

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

When `animated={false}`, open/close updates immediately and duration/delay are ignored. `prefers-reduced-motion` also disables motion.

CSS variables on the content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```svelte
<CollapsibleContent forceMount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### Quick start

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

### `Accordion` props (shared)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Selection mode |
| `animated` | `boolean` | `true` | Height animation for item panels |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Easing for all items |
| `animationDuration` | `number` | `200` | Duration in milliseconds |
| `animationDelay` | `number` | `0` | Delay in milliseconds |
| `disabled` | `boolean` | `false` | Disables the whole accordion |
| `class` / other attrs | — | — | Forwarded to the root element |

Animation props are owned by the Accordion root and inherited by every item.

### `Accordion` props (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Controlled open item (`bind:value`) |
| `defaultValue` | `string \| null` | `null` | Uncontrolled initial item |
| `collapsible` | `boolean` | `false` | Allow closing the open item |
| `onValueChange` | `(value: string \| null) => void` | — | Value change callback |

### `Accordion` props (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Controlled open items (`bind:value`) |
| `defaultValue` | `string[]` | `[]` | Uncontrolled initial items |
| `onValueChange` | `(value: string[]) => void` | — | Value change callback |

`collapsible` does not apply in multiple mode.

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | Stable item id |
| `disabled` | `boolean` | `false` | Disables this item |
| `class` / other attrs | — | — | Forwarded to the item root |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Disables this trigger |
| `class` / other attrs | — | — | Forwarded to the native `<button>` |

Keyboard: Arrow Up/Down, Home, End.

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content mounted while closed |
| `class` / `style` | — | — | Applied to the inner clipped wrapper |
| other attrs | — | — | Forwarded to the inner wrapper |

### Multiple mode example

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

### Accordion with custom animation

```svelte
<Accordion
  type="single"
  collapsible
  animationTimingFunction="ease-in-out"
  animationDuration={300}
  animationDelay={0}
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

## AI Agent Skill

Practical Svelte usage for AI coding agents: [disclosure-svelte skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-svelte.md).

## License

MIT © Zealakit
