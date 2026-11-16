import { computed, defineComponent, h, inject, onMounted, toRef } from "vue";
import { getAnimationStyle } from "./animation.js";
import { CollapsibleContextKey } from "./collapsible-context.js";
import { ensureCollapsibleStyles } from "./styles.js";
import { usePresence } from "./use-presence.js";

export const CollapsibleContent = defineComponent({
  name: "CollapsibleContent",
  inheritAttrs: false,
  props: {
    forceMount: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const context = inject(CollapsibleContextKey);

    if (!context) {
      throw new Error(
        "CollapsibleContent must be used within a <Collapsible> root",
      );
    }

    const open = computed(() => context.open);
    const animated = computed(() => context.animation.enabled);
    const forceMount = toRef(props, "forceMount");
    const presence = usePresence(open, { animated, forceMount });

    onMounted(() => {
      ensureCollapsibleStyles();
    });

    const state = computed(() => (presence.present.value ? "open" : "closed"));
    const animationStyle = computed(() => getAnimationStyle(context.animation));

    return () => {
      if (!presence.mounted.value) {
        return null;
      }
      const { id: _id, class: className, style, ...rest } = attrs;
      return h(
        "div",
        {
          id: (attrs.id as string | undefined) ?? context.contentId,
          "data-slot": "collapsible-content",
          "data-state": state.value,
          "data-animated": presence.animated.value ? "" : undefined,
          hidden: !presence.present.value && !presence.animated.value,
          inert: !context.open ? true : undefined,
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
