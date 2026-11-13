<script lang="ts">
import { onMount } from "svelte";
import {
  getAccordionContext,
  getAccordionItemContext,
} from "./accordion-context.js";
import { getCollapsibleAnimationStyleText } from "./animation.js";
import { ensureCollapsibleStyles } from "./collapsible-styles.js";
import { createPresence } from "./use-presence.svelte.js";

type Props = {
  forceMount?: boolean;
  children?: import("svelte").Snippet;
  class?: string;
  id?: string;
  style?: string | null;
  ontransitionend?: (event: TransitionEvent) => void;
  [key: string]: unknown;
};

let {
  forceMount = false,
  children,
  class: className,
  id,
  style,
  ontransitionend,
  ...rest
}: Props = $props();

const accordion = getAccordionContext();
const item = getAccordionItemContext();
const presence = createPresence({
  open: () => item.open,
  animated: () => accordion.animated,
  forceMount: () => forceMount,
});

const animationStyle = $derived(
  getCollapsibleAnimationStyleText({
    animationTimingFunction: accordion.animationTimingFunction,
    animationDuration: accordion.animationDuration,
    animationDelay: accordion.animationDelay,
  }),
);

onMount(() => {
  ensureCollapsibleStyles();
});

function handleTransitionEnd(event: TransitionEvent) {
  ontransitionend?.(event);
  presence.onTransitionEnd(event);
}
</script>

{#if presence.mounted}
  <section
    id={id ?? item.contentId}
    aria-labelledby={item.triggerId}
    data-slot="accordion-content"
    data-state={presence.present ? "open" : "closed"}
    data-animated={presence.animated ? "" : undefined}
    hidden={!presence.present && !presence.animated}
    inert={!item.open ? true : undefined}
    style={animationStyle}
    ontransitionend={handleTransitionEnd}
  >
    <div
      {...rest}
      class={className}
      {style}
      data-collapsible-content-wrapper=""
      data-state={presence.present ? "open" : "closed"}
    >
      {@render children?.()}
    </div>
  </section>
{/if}
