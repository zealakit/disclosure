import { computed, defineComponent, h, inject, onMounted, toRef } from "vue";
import {
  AccordionContextKey,
  AccordionItemContextKey,
} from "./accordion-context.js";
import { getAnimationStyle } from "./animation.js";
import { ensureCollapsibleStyles } from "./styles.js";
import { usePresence } from "./use-presence.js";

export const AccordionContent = defineComponent({
  name: "AccordionContent",
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const accordion = inject(AccordionContextKey);
    const item = inject(AccordionItemContextKey);

    if (!accordion || !item) {
      throw new Error(
        "AccordionContent must be used within an <AccordionItem>",
      );
    }

    const open = computed(() => item.open);
    const animated = computed(() => accordion.animation.enabled);
    const forceMount = toRef(props, "forceMount");
    const presence = usePresence(open, { animated, forceMount });

    onMounted(() => {
      ensureCollapsibleStyles();
    });

    const state = computed(() => (presence.present.value ? "open" : "closed"));
    const animationStyle = computed(() =>
      getAnimationStyle(accordion.animation),
    );

    return () => {
      if (!presence.mounted.value) {
        return null;
      }
      const { id: _id, class: className, style, ...rest } = attrs;
      return h(
        "section",
        {
          id: (attrs.id as string | undefined) ?? item.contentId,
          "aria-labelledby": item.triggerId,
          "data-slot": "accordion-content",
          "data-state": state.value,
          "data-animated": presence.animated.value ? "" : undefined,
          hidden: !presence.present.value && !presence.animated.value,
          inert: !open.value ? true : undefined,
          style: animationStyle.value,
          onTransitionend: presence.onTransitionEnd,
        },
        [
          h(
            "div",
            {
              "data-collapsible-content-wrapper": "",
              "data-state": state.value,
              class: className,
              style,
              ...rest,
            },
            slots.default?.(),
          ),
        ],
      );
    };
  },
});
