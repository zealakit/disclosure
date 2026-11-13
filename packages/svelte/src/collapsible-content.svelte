<script lang="ts">
import { onMount } from "svelte";
import { getCollapsibleAnimationStyleText } from "./animation.js";
import { getCollapsibleContext } from "./collapsible-context.js";
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

const context = getCollapsibleContext();
const presence = createPresence({
  open: () => context.open,
  animated: () => context.animated,
  forceMount: () => forceMount,
});

const animationStyle = $derived(
  getCollapsibleAnimationStyleText({
    animationTimingFunction: context.animationTimingFunction,
    animationDuration: context.animationDuration,
    animationDelay: context.animationDelay,
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
  <div
    id={id ?? context.contentId}
    data-slot="collapsible-content"
    data-state={presence.present ? "open" : "closed"}
    data-animated={presence.animated ? "" : undefined}
    hidden={!presence.present && !presence.animated}
    inert={!context.open ? true : undefined}
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
  </div>
{/if}
