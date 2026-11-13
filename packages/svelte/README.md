# @zealakit/collapsible-svelte

Headless Collapsible primitives for Svelte 5.

See [docs/svelte.md](../../docs/svelte.md) for the full API.

```bash
pnpm add @zealakit/collapsible-svelte
```

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
