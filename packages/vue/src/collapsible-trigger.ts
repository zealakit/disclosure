import { computed, defineComponent, h, inject, mergeProps } from "vue";
import { CollapsibleContextKey } from "./collapsible-context.js";

export const CollapsibleTrigger = defineComponent({
  name: "CollapsibleTrigger",
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const context = inject(CollapsibleContextKey);

    if (!context) {
      throw new Error(
        "CollapsibleTrigger must be used within a <Collapsible> root",
      );
    }

    const isDisabled = computed(() =>
      Boolean(props.disabled ?? context.disabled),
    );

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isDisabled.value) {
        return;
      }
      context.setOpen(!context.open);
    };

    return () =>
      h(
        "button",
        mergeProps(attrs, {
          type: "button",
          id: (attrs.id as string | undefined) ?? context.triggerId,
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          disabled: isDisabled.value,
          "data-slot": "collapsible-trigger",
          "data-state": context.open ? "open" : "closed",
          "data-disabled": isDisabled.value ? "" : undefined,
          onClick: handleClick,
        }),
        slots.default?.(),
      );
  },
});
