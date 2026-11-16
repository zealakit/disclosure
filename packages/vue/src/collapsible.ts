import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  mergeProps,
  type PropType,
  provide,
  reactive,
  ref,
  useId,
  watch,
} from "vue";
import {
  type AnimationSetting,
  normalizeAnimationConfig,
} from "./animation.js";
import {
  CollapsibleContextKey,
  type CollapsibleContextValue,
} from "./collapsible-context.js";

export const Collapsible = defineComponent({
  name: "Collapsible",
  inheritAttrs: false,
  props: {
    defaultOpen: { type: Boolean, default: false },
    open: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    animation: {
      type: [Boolean, Object] as PropType<AnimationSetting>,
      default: undefined,
    },
  },
  emits: {
    "update:open": (_open: boolean) => true,
    openChange: (_open: boolean) => true,
  },
  setup(props, { attrs, slots, emit }) {
    const instance = getCurrentInstance();
    const reactId = useId();
    const uncontrolledOpen = ref(props.defaultOpen);

    const isControlled = () => instance?.vnode.props?.open !== undefined;

    const resolvedOpen = computed(() =>
      isControlled() ? Boolean(props.open) : uncontrolledOpen.value,
    );

    const animation = computed(() => normalizeAnimationConfig(props.animation));

    const context = reactive<CollapsibleContextValue>({
      open: resolvedOpen.value,
      disabled: props.disabled,
      animation: animation.value,
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
        context.animation = value;
      },
      { immediate: true },
    );

    provide(CollapsibleContextKey, context);

    return () =>
      h(
        "div",
        mergeProps(attrs, {
          "data-slot": "collapsible",
          "data-state": context.open ? "open" : "closed",
          "data-disabled": context.disabled ? "" : undefined,
        }),
        slots.default?.(),
      );
  },
});
