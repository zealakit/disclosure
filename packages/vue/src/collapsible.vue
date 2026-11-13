<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  provide,
  reactive,
  ref,
  useAttrs,
  useId,
  watch,
} from "vue";
import {
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  resolveAnimationConfig,
} from "./animation";
import {
  CollapsibleContextKey,
  type CollapsibleContextValue,
} from "./collapsible-context";
import type { CollapsibleProps } from "./collapsible.types";

defineOptions({
  name: "Collapsible",
  inheritAttrs: false,
});

const props = withDefaults(defineProps<CollapsibleProps>(), {
  defaultOpen: false,
  disabled: false,
  animated: true,
  animationTimingFunction: DEFAULT_ANIMATION_TIMING_FUNCTION,
  animationDuration: DEFAULT_ANIMATION_DURATION_MS,
  animationDelay: DEFAULT_ANIMATION_DELAY_MS,
});

const emit = defineEmits<{
  "update:open": [open: boolean];
  openChange: [open: boolean];
}>();

const attrs = useAttrs();
const instance = getCurrentInstance();
const reactId = useId();
const uncontrolledOpen = ref(props.defaultOpen);

const isControlled = () => instance?.vnode.props?.open !== undefined;

const resolvedOpen = computed(() =>
  isControlled() ? Boolean(props.open) : uncontrolledOpen.value,
);

const animation = computed(() =>
  resolveAnimationConfig({
    animated: props.animated,
    animationTimingFunction: props.animationTimingFunction,
    animationDuration: props.animationDuration,
    animationDelay: props.animationDelay,
  }),
);

const context = reactive<CollapsibleContextValue>({
  open: resolvedOpen.value,
  disabled: props.disabled,
  animated: animation.value.animated,
  animationTimingFunction: animation.value.animationTimingFunction,
  animationDuration: animation.value.animationDuration,
  animationDelay: animation.value.animationDelay,
  contentId: `collapsible-content-${reactId}`,
  triggerId: `collapsible-trigger-${reactId}`,
  setOpen(next: boolean) {
    if (!isControlled()) {
      uncontrolledOpen.value = next;
    }
    emit("update:open", next);
    emit("openChange", next);
  },
});

watch(
  resolvedOpen,
  (value) => {
    context.open = value;
  },
  { immediate: true },
);

watch(
  () => props.disabled,
  (value) => {
    context.disabled = value;
  },
);

watch(
  animation,
  (value) => {
    context.animated = value.animated;
    context.animationTimingFunction = value.animationTimingFunction;
    context.animationDuration = value.animationDuration;
    context.animationDelay = value.animationDelay;
  },
  { immediate: true },
);

provide(CollapsibleContextKey, context);

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <div
    v-bind="restAttrs"
    data-slot="collapsible"
    :data-state="context.open ? 'open' : 'closed'"
    :data-disabled="context.disabled ? '' : undefined"
    :class="attrs.class"
  >
    <slot />
  </div>
</template>
