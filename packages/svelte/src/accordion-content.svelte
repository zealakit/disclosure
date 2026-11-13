<script lang="ts">
import { onMount } from "svelte";
import {
  getAccordionContext,
  getAccordionItemContext,
} from "./accordion-context.js";
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

const accordion = getAccordionContext();
const item = getAccordionItemContext();
const presence = createPresence({
  open: () => item.open,
  animated: () => accordion.animated,
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
  <section
    {...rest}
    id={id ?? item.contentId}
    class={className}
    aria-labelledby={item.triggerId}
    data-slot="accordion-content"
    data-state={presence.present ? "open" : "closed"}
    data-animated={presence.animated ? "" : undefined}
    hidden={!presence.present && !presence.animated}
    inert={!item.open ? true : undefined}
    ontransitionend={handleTransitionEnd}
  >
    <div data-collapsible-content-wrapper="">
      {@render children?.()}
    </div>
  </section>
{/if}
