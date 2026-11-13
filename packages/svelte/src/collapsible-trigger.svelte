<script lang="ts">
import { getCollapsibleContext } from "./collapsible-context.js";

type Props = {
  disabled?: boolean;
  children?: import("svelte").Snippet;
  class?: string;
  id?: string;
  onclick?: (event: MouseEvent) => void;
  [key: string]: unknown;
};

let {
  disabled: disabledProp,
  children,
  class: className,
  id,
  onclick,
  ...rest
}: Props = $props();

const context = getCollapsibleContext();
const isDisabled = $derived(disabledProp ?? context.disabled);

function handleClick(event: MouseEvent) {
  onclick?.(event);
  if (event.defaultPrevented || isDisabled) {
    return;
  }
  context.setOpen(!context.open);
}
</script>

<button
  type="button"
  {...rest}
  id={id ?? context.triggerId}
  class={className}
  aria-expanded={context.open}
  aria-controls={context.contentId}
  disabled={isDisabled}
  data-slot="collapsible-trigger"
  data-state={context.open ? "open" : "closed"}
  data-disabled={isDisabled ? "" : undefined}
  onclick={handleClick}
>
  {@render children?.()}
</button>
