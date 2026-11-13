import { computed, onMounted, ref, watch, type Ref } from "vue";
import { prefersReducedMotion } from "./collapsible-styles";

export function usePresence(
  open: Ref<boolean>,
  options: {
    animated?: Ref<boolean> | boolean;
    forceMount?: Ref<boolean> | boolean;
  } = {},
) {
  const animatedOption = computed(() =>
    typeof options.animated === "boolean"
      ? options.animated
      : (options.animated?.value ?? true),
  );
  const forceMount = computed(() =>
    typeof options.forceMount === "boolean"
      ? options.forceMount
      : (options.forceMount?.value ?? false),
  );

  const shouldAnimate = computed(
    () => animatedOption.value && !prefersReducedMotion(),
  );

  const mounted = ref(open.value || forceMount.value);
  const present = ref(open.value);

  watch(
    open,
    (isOpen) => {
      if (isOpen) {
        mounted.value = true;
        if (!shouldAnimate.value) {
          present.value = true;
          return;
        }
        requestAnimationFrame(() => {
          present.value = true;
        });
        return;
      }

      present.value = false;
      if (!shouldAnimate.value || forceMount.value) {
        if (!forceMount.value) {
          mounted.value = false;
        }
      }
    },
    { flush: "post" },
  );

  watch(forceMount, (value) => {
    if (value) {
      mounted.value = true;
    } else if (!open.value && !shouldAnimate.value) {
      mounted.value = false;
    }
  });

  onMounted(() => {
    if (open.value) {
      present.value = true;
      mounted.value = true;
    }
  });

  const onTransitionEnd = (event: TransitionEvent) => {
    if (
      event.currentTarget != null &&
      event.target !== event.currentTarget
    ) {
      return;
    }
    if (
      event.propertyName &&
      event.propertyName !== "grid-template-rows"
    ) {
      return;
    }
    if (!open.value && !forceMount.value) {
      mounted.value = false;
    }
  };

  return {
    mounted: computed(() => forceMount.value || mounted.value),
    present,
    animated: shouldAnimate,
    onTransitionEnd,
  };
}
