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
} from "vue";
import {
  AccordionContextKey,
  type AccordionContextValue,
} from "./accordion-context.js";
import {
  type AnimationSetting,
  normalizeAnimationConfig,
} from "./animation.js";

export const Accordion = defineComponent({
  name: "Accordion",
  inheritAttrs: false,
  props: {
    type: {
      type: String as PropType<"single" | "multiple">,
      default: "single",
    },
    value: {
      type: [String, Array] as PropType<string | string[] | null>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Array] as PropType<string | string[] | null>,
      default: undefined,
    },
    collapsible: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    animation: {
      type: [Boolean, Object] as PropType<AnimationSetting>,
      default: undefined,
    },
  },
  emits: {
    "update:value": (_value: string | null | string[]) => true,
    valueChange: (_value: string | null | string[]) => true,
  },
  setup(props, { attrs, slots, emit }) {
    const instance = getCurrentInstance();

    const uncontrolledSingle = ref<string | null>(
      props.type === "multiple"
        ? null
        : ((props.defaultValue as string | null | undefined) ?? null),
    );
    const uncontrolledMultiple = ref<string[]>(
      props.type === "multiple"
        ? [...((props.defaultValue as string[] | undefined) ?? [])]
        : [],
    );

    const triggers = new Map<string, HTMLButtonElement>();
    const triggerOrder: string[] = [];

    const isControlled = () => instance?.vnode.props?.value !== undefined;

    const resolvedType = computed(() => props.type ?? "single");

    const singleValue = computed(() => {
      if (resolvedType.value !== "single") {
        return null;
      }
      if (isControlled()) {
        return (props.value as string | null | undefined) ?? null;
      }
      return uncontrolledSingle.value;
    });

    const multipleValue = computed(() => {
      if (resolvedType.value !== "multiple") {
        return [] as string[];
      }
      if (isControlled()) {
        return [...((props.value as string[] | undefined) ?? [])];
      }
      return uncontrolledMultiple.value;
    });

    const animation = computed(() => normalizeAnimationConfig(props.animation));

    const context = reactive<AccordionContextValue>({
      get type() {
        return resolvedType.value;
      },
      get animation() {
        return animation.value;
      },
      get disabled() {
        return Boolean(props.disabled);
      },
      get collapsible() {
        return resolvedType.value === "single"
          ? Boolean(props.collapsible)
          : false;
      },
      isItemOpen(itemValue: string) {
        if (resolvedType.value === "multiple") {
          return multipleValue.value.includes(itemValue);
        }
        return singleValue.value === itemValue;
      },
      toggleItem(itemValue: string) {
        if (context.disabled) {
          return;
        }

        if (resolvedType.value === "multiple") {
          const exists = multipleValue.value.includes(itemValue);
          const next = exists
            ? multipleValue.value.filter((value) => value !== itemValue)
            : [...multipleValue.value, itemValue];
          if (!isControlled()) {
            uncontrolledMultiple.value = next;
          }
          emit("update:value", next);
          emit("valueChange", next);
          return;
        }

        const isOpen = singleValue.value === itemValue;
        const next = isOpen
          ? context.collapsible
            ? null
            : singleValue.value
          : itemValue;
        if (next === singleValue.value) {
          return;
        }
        if (!isControlled()) {
          uncontrolledSingle.value = next;
        }
        emit("update:value", next);
        emit("valueChange", next);
      },
      registerTrigger(itemValue: string, node: HTMLButtonElement | null) {
        if (node) {
          triggers.set(itemValue, node);
          if (!triggerOrder.includes(itemValue)) {
            triggerOrder.push(itemValue);
          }
        } else {
          triggers.delete(itemValue);
          const index = triggerOrder.indexOf(itemValue);
          if (index >= 0) {
            triggerOrder.splice(index, 1);
          }
        }
      },
      getEnabledTriggerValues() {
        return triggerOrder.filter((value) => {
          const node = triggers.get(value);
          return Boolean(node && !node.disabled);
        });
      },
      focusTrigger(itemValue: string) {
        triggers.get(itemValue)?.focus();
      },
    });

    provide(AccordionContextKey, context);

    return () =>
      h(
        "div",
        mergeProps(attrs, {
          "data-slot": "accordion",
          "data-orientation": "vertical",
          "data-disabled": context.disabled ? "" : undefined,
        }),
        slots.default?.(),
      );
  },
});
