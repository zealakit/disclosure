<script lang="ts">
import { onMount } from "svelte";
import { getCollapsibleContext } from "./collapsible-context.js";
import { ensureCollapsibleStyles } from "./collapsible-styles.js";
import { createPresence } from "./use-presence.svelte.js";

type Props = {
  forceMount?: boolean;
  children?: import("svelte").Snippet;
  class?: string;
  id?: string;
  ontransitionend?: (event: TransitionEvent) => void;
  [key: string]: unknown;
};

let {
  forceMount = false,
  children,
  class: className,
  id,
  ontransitionend,
  ...rest
}: Props = $props();

const context = getCollapsibleContext();
const presence = createPresence({
  open: () => context.open,
  animated: () => context.animated,
  forceMount: () => forceMount,
});

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
    {...rest}
    id={id ?? context.contentId}
    class={className}
    data-slot="collapsible-content"
    data-state={presence.present ? "open" : "closed"}
    data-animated={presence.animated ? "" : undefined}
    hidden={!presence.present && !presence.animated}
    inert={!context.open ? true : undefined}
    ontransitionend={handleTransitionEnd}
  >
    <div data-collapsible-content-wrapper="">
      {@render children?.()}
    </div>
  </div>
{/if}
