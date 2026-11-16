<script setup lang="ts">
import { computed, inject, onMounted, toRef, useAttrs } from "vue";
import {
  AccordionContextKey,
  AccordionItemContextKey,
} from "./accordion-context";
import { getAnimationStyle } from "./animation";
import { ensureCollapsibleStyles } from "./collapsible-styles";
import type { AccordionContentProps } from "./accordion.types";
import { usePresence } from "./use-presence";

defineOptions({
  name: "AccordionContent",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<AccordionContentProps>(), {
  forceMount: false,
});

const attrs = useAttrs();
const accordion = inject(AccordionContextKey);
const item = inject(AccordionItemContextKey);

if (!accordion || !item) {
  throw new Error("AccordionContent must be used within an <AccordionItem>");
}

const open = computed(() => item.open);
const animated = computed(() => accordion.animation.enabled);
const forceMount = toRef(props, "forceMount");
const presence = usePresence(open, { animated, forceMount });

onMounted(() => {
  ensureCollapsibleStyles();
});

const panelAttrs = computed(() => {
  const { id: _id, class: className, style, ...rest } = attrs;
  return {
    class: className,
    style,
    ...rest,
  };
});

const state = computed(() => (presence.present.value ? "open" : "closed"));

const animationStyle = computed(() => getAnimationStyle(accordion.animation));
</script>

<template>
  <section
    v-if="presence.mounted.value"
    :id="(attrs.id as string | undefined) ?? item.contentId"
    :aria-labelledby="item.triggerId"
    data-slot="accordion-content"
    :data-state="state"
    :data-animated="presence.animated.value ? '' : undefined"
    :hidden="!presence.present.value && !presence.animated.value"
    :inert="!open ? true : undefined"
    :style="animationStyle"
    @transitionend="presence.onTransitionEnd"
  >
    <div
      data-collapsible-content-wrapper=""
      :data-state="state"
      v-bind="panelAttrs"
    >
      <slot />
    </div>
  </section>
</template>
