<script setup lang="ts">
import { computed, inject, provide, ref, useAttrs, useId } from "vue";
import {
  AccordionContextKey,
  AccordionItemContextKey,
  type AccordionItemContextValue,
} from "./accordion-context";
import type { AccordionItemProps } from "./accordion.types";

defineOptions({
  name: "AccordionItem",
  inheritAttrs: false,
});

const props = defineProps<AccordionItemProps>();
const attrs = useAttrs();
const accordion = inject(AccordionContextKey);

if (!accordion) {
  throw new Error("AccordionItem must be used within an <Accordion>");
}

const reactId = useId();
const triggerEl = ref<HTMLButtonElement | null>(null);

const open = computed(() => accordion.isItemOpen(props.value));
const disabled = computed(() => Boolean(accordion.disabled || props.disabled));

const itemContext: AccordionItemContextValue = {
  get value() {
    return props.value;
  },
  get open() {
    return open.value;
  },
  get disabled() {
    return disabled.value;
  },
  contentId: `accordion-content-${reactId}`,
  triggerId: `accordion-trigger-${reactId}`,
  triggerEl,
};

provide(AccordionItemContextKey, itemContext);

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <div
    v-bind="restAttrs"
    data-slot="accordion-item"
    :data-state="open ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :class="attrs.class"
  >
    <slot />
  </div>
</template>
