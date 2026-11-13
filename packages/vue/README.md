# @zealakit/disclosure-vue

[English](https://github.com/zealakit/disclosure/blob/main/packages/vue/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Headless Collapsible and Accordion for Vue 3. Built-in height animation is enabled by default. You own visual styling.

Apply padding, borders, and backgrounds via `class` on `CollapsibleContent` / `AccordionContent` (or `[data-collapsible-content-wrapper]`). Those styles land on the clipped content panel so exit animations collapse cleanly.

> **Note**
>
> Disclosure is not a replacement for a full UI library. Use it when Accordion or Collapsible in your kit is hard to restyle — or when you only need that one primitive and don’t want to pull in a large design system.

## Install

```bash
npm i @zealakit/disclosure-vue
# or: pnpm add / yarn add / bun add
```

Peer dependency: `vue` (^3.5).

## Collapsible

### Quick start

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

### `Collapsible` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state when uncontrolled |
| `open` | `boolean` | — | Controlled open state (`v-model:open`) |
| `disabled` | `boolean` | `false` | Disables the whole collapsible |
| `animated` | `boolean` | `true` | Enables height expand/collapse animation |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Transition easing |
| `animationDuration` | `number` | `200` | Duration in milliseconds |
| `animationDelay` | `number` | `0` | Delay in milliseconds |

### `Collapsible` events

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | `v-model:open` update |
| `openChange` | `boolean` | Open-state change callback |

Root attributes: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` when disabled.

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Disables this trigger |

Sets `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"`, and `data-state`. Extra attributes fall through to the native `<button>`.

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content in the DOM while closed |

`class` / `style` and other attrs apply to the **inner** content wrapper (clipped during animation). Prefer borders/padding there.

### Controlled usage

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

### Animation configuration

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

When `animated` is `false`, open/close updates immediately and duration/delay are ignored. `prefers-reduced-motion` also disables motion.

CSS variables on the content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```vue
<CollapsibleContent force-mount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### Quick start

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

### `Accordion` props (shared)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Selection mode |
| `animated` | `boolean` | `true` | Height animation for item panels |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Easing for all items |
| `animationDuration` | `number` | `200` | Duration in milliseconds |
| `animationDelay` | `number` | `0` | Delay in milliseconds |
| `disabled` | `boolean` | `false` | Disables the whole accordion |

Animation props are owned by the Accordion root and inherited by every item.

### `Accordion` props (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Controlled open item (`v-model:value`) |
| `defaultValue` | `string \| null` | `null` | Uncontrolled initial item |
| `collapsible` | `boolean` | `false` | Allow closing the open item |

### `Accordion` props (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Controlled open items (`v-model:value`) |
| `defaultValue` | `string[]` | `[]` | Uncontrolled initial items |

`collapsible` does not apply in multiple mode.

### `Accordion` events

| Event | Payload | Description |
| --- | --- | --- |
| `update:value` | `string \| null \| string[]` | `v-model:value` update |
| `valueChange` | `string \| null \| string[]` | Value change callback |

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | Stable item id |
| `disabled` | `boolean` | `false` | Disables this item |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Disables this trigger |

Keyboard: Arrow Up/Down, Home, End.

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Keep content mounted while closed |

`class` / `style` apply to the inner clipped wrapper.

### Multiple mode example

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

### Accordion with custom animation

```vue
<Accordion
  type="single"
  collapsible
  animation-timing-function="ease-in-out"
  :animation-duration="300"
  :animation-delay="0"
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

Practical Vue usage for AI coding agents: [disclosure-vue skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vue.md).

## License

MIT © Zealakit
