<script setup lang="ts">
import { computed, inject, useAttrs } from "vue";
import { CollapsibleContextKey } from "./collapsible-context";
import type { CollapsibleTriggerProps } from "./collapsible.types";

defineOptions({
  name: "CollapsibleTrigger",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CollapsibleTriggerProps>(), {
  disabled: undefined,
});

const attrs = useAttrs();
const context = inject(CollapsibleContextKey);

if (!context) {
  throw new Error(
    "CollapsibleTrigger must be used within a <Collapsible> root",
  );
}

const isDisabled = computed(() => Boolean(props.disabled ?? context.disabled));

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const handleClick = (event: MouseEvent) => {
  if (event.defaultPrevented || isDisabled.value) {
    return;
  }
  context.setOpen(!context.open);
};
</script>

<template>
  <button
    v-bind="restAttrs"
    type="button"
    :id="(attrs.id as string | undefined) ?? context.triggerId"
    :aria-expanded="context.open"
    :aria-controls="context.contentId"
    :disabled="isDisabled"
    data-slot="collapsible-trigger"
    :data-state="context.open ? 'open' : 'closed'"
    :data-disabled="isDisabled ? '' : undefined"
    :class="attrs.class"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
