import {
  computed,
  defineComponent,
  h,
  inject,
  mergeProps,
  provide,
  ref,
  useId,
} from "vue";
import {
  AccordionContextKey,
  AccordionItemContextKey,
  type AccordionItemContextValue,
} from "./accordion-context.js";

export const AccordionItem = defineComponent({
  name: "AccordionItem",
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const accordion = inject(AccordionContextKey);

    if (!accordion) {
      throw new Error("AccordionItem must be used within an <Accordion>");
    }

    const reactId = useId();
    const triggerEl = ref<HTMLButtonElement | null>(null);

    const open = computed(() => accordion.isItemOpen(props.value));
    const disabled = computed(() =>
      Boolean(accordion.disabled || props.disabled),
    );

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

    return () =>
      h(
        "div",
        mergeProps(attrs, {
          "data-slot": "accordion-item",
          "data-state": open.value ? "open" : "closed",
          "data-disabled": disabled.value ? "" : undefined,
        }),
        slots.default?.(),
      );
  },
});
