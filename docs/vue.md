# @zealakit/collapsible-vue

Headless Collapsible and Accordion for Vue 3. Built-in height animation is enabled by default. You own visual styling.

## Install

```bash
pnpm add @zealakit/collapsible-vue
```

Peer dependency: `vue` (^3.5).

## Collapsible

```vue
<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-vue";
</script>

<template>
  <Collapsible>
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

### Props / events

| Prop / Event | Description |
| --- | --- |
| `defaultOpen` | Uncontrolled initial state |
| `open` / `v-model:open` | Controlled open state |
| `@update:open` / `@openChange` | Change events |
| `disabled` | Disables interaction |
| `animated` | Height animation (`true` by default) |

Disable animation with `:animated="false"`. Customize with `--collapsible-animation-duration` and `--collapsible-animation-easing`.

## Accordion

```vue
<template>
  <Accordion type="single" collapsible>
    <AccordionItem value="general">
      <AccordionTrigger>General</AccordionTrigger>
      <AccordionContent>General content</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

- Single: `value` / `defaultValue` / `v-model:value` as `string | null`, optional `collapsible`
- Multiple: `type="multiple"`, values as `string[]`
- Events: `@update:value`, `@valueChange`
- Shared: `animated`, `disabled`
