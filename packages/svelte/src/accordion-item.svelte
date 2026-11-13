<script lang="ts">
import {
  getAccordionContext,
  setAccordionItemContext,
} from "./accordion-context.js";

type Props = {
  value: string;
  disabled?: boolean;
  children?: import("svelte").Snippet;
  class?: string;
  [key: string]: unknown;
};

let {
  value,
  disabled: disabledProp,
  children,
  class: className,
  ...rest
}: Props = $props();

const accordion = getAccordionContext();
const instanceId = crypto.randomUUID();

const open = $derived(accordion.isItemOpen(value));
const disabled = $derived(Boolean(accordion.disabled || disabledProp));

setAccordionItemContext({
  get value() {
    return value;
  },
  get open() {
    return open;
  },
  get disabled() {
    return disabled;
  },
  triggerId: `accordion-trigger-${instanceId}`,
  contentId: `accordion-content-${instanceId}`,
});
</script>

<div
  {...rest}
  class={className}
  data-slot="accordion-item"
  data-state={open ? "open" : "closed"}
  data-disabled={disabled ? "" : undefined}
>
  {@render children?.()}
</div>
