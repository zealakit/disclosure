<script setup lang="ts">
import { computed, inject, onMounted, toRef, useAttrs } from "vue";
import { getCollapsibleAnimationStyle } from "./animation";
import { CollapsibleContextKey } from "./collapsible-context";
import { ensureCollapsibleStyles } from "./collapsible-styles";
import type { CollapsibleContentProps } from "./collapsible.types";
import { usePresence } from "./use-presence";

defineOptions({
  name: "CollapsibleContent",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CollapsibleContentProps>(), {
  forceMount: false,
});

const attrs = useAttrs();
const context = inject(CollapsibleContextKey);

if (!context) {
  throw new Error(
    "CollapsibleContent must be used within a <Collapsible> root",
  );
}

const open = computed(() => context.open);
const animated = computed(() => context.animated);
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

const animationStyle = computed(() =>
  getCollapsibleAnimationStyle({
    animationTimingFunction: context.animationTimingFunction,
    animationDuration: context.animationDuration,
    animationDelay: context.animationDelay,
  }),
);
</script>

<template>
  <div
    v-if="presence.mounted.value"
    :id="(attrs.id as string | undefined) ?? context.contentId"
    data-slot="collapsible-content"
    :data-state="state"
    :data-animated="presence.animated.value ? '' : undefined"
    :hidden="!presence.present.value && !presence.animated.value"
    :inert="!context.open ? true : undefined"
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
  </div>
</template>
