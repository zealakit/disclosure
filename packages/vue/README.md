# @zealakit/collapsible-vue

Headless Collapsible primitives for Vue 3.

See [docs/vue.md](../../docs/vue.md) for the full API.

```bash
pnpm add @zealakit/collapsible-vue
```

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
