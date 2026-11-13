# @zealakit/collapsible-svelte

Headless Collapsible and Accordion for Svelte 5. Built-in height animation is enabled by default. You own visual styling.

## Install

```bash
pnpm add @zealakit/collapsible-svelte
```

Peer dependency: `svelte` (^5).

## Collapsible

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/collapsible-svelte";
</script>

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

Props: `defaultOpen`, `open` (`bind:open`), `onOpenChange`, `disabled`, `animated` (default `true`). Content supports `forceMount`.

Disable animation with `animated={false}`. Customize with `--collapsible-animation-duration` and `--collapsible-animation-easing`.

## Accordion

```svelte
<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from "@zealakit/collapsible-svelte";
</script>

<Accordion type="single" collapsible>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
</Accordion>
```

- Single / multiple modes with `value` / `defaultValue` / `bind:value` / `onValueChange`
- `collapsible` only for single mode
- Shared: `animated`, `disabled`
- Keyboard: Arrow Up/Down, Home, End
