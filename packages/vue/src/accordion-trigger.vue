<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  useAttrs,
  type ComponentPublicInstance,
} from "vue";
import {
  AccordionContextKey,
  AccordionItemContextKey,
} from "./accordion-context";
import type { AccordionTriggerProps } from "./accordion.types";

defineOptions({
  name: "AccordionTrigger",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AccordionTriggerProps>(), {
  disabled: undefined,
});

const attrs = useAttrs();
const accordion = inject(AccordionContextKey);
const item = inject(AccordionItemContextKey);

if (!accordion || !item) {
  throw new Error("AccordionTrigger must be used within an <AccordionItem>");
}

const isDisabled = computed(() => Boolean(props.disabled ?? item.disabled));
const isOpen = computed(() => item.open);

const setTriggerRef = (
  node: Element | ComponentPublicInstance | null,
) => {
  const button =
    node && "tagName" in node ? (node as HTMLButtonElement) : null;
  item.triggerEl.value = button;
  accordion.registerTrigger(item.value, isDisabled.value ? null : button);
};

onBeforeUnmount(() => {
  accordion.registerTrigger(item.value, null);
});

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});

const handleClick = (event: MouseEvent) => {
  if (event.defaultPrevented || isDisabled.value) {
    return;
  }
  accordion.toggleItem(item.value);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.defaultPrevented || isDisabled.value) {
    return;
  }

  const enabled = accordion.getEnabledTriggerValues();
  const currentIndex = enabled.indexOf(item.value);
  if (currentIndex === -1 || enabled.length === 0) {
    return;
  }

  const focusAt = (index: number) => {
    const next = enabled[index];
    if (next) {
      event.preventDefault();
      accordion.focusTrigger(next);
    }
  };

  switch (event.key) {
    case "ArrowDown":
      focusAt((currentIndex + 1) % enabled.length);
      break;
    case "ArrowUp":
      focusAt((currentIndex - 1 + enabled.length) % enabled.length);
      break;
    case "Home":
      focusAt(0);
      break;
    case "End":
      focusAt(enabled.length - 1);
      break;
    default:
      break;
  }
};
</script>

<template>
  <h3 data-slot="accordion-heading">
    <button
      v-bind="restAttrs"
      :ref="setTriggerRef"
      type="button"
      :id="(attrs.id as string | undefined) ?? item.triggerId"
      :aria-expanded="isOpen"
      :aria-controls="item.contentId"
      :disabled="isDisabled"
      data-slot="accordion-trigger"
      :data-state="isOpen ? 'open' : 'closed'"
      :data-disabled="isDisabled ? '' : undefined"
      :class="attrs.class"
      @click="handleClick"
      @keydown="handleKeyDown"
    >
      <slot />
    </button>
  </h3>
</template>
