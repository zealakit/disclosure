<script lang="ts">
import { untrack } from "svelte";
import {
  normalizeAnimationConfig,
  type AnimationSetting,
} from "./animation.js";
import { setCollapsibleContext } from "./collapsible-context.js";

type Props = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  animation?: AnimationSetting;
  children?: import("svelte").Snippet;
  class?: string;
  [key: string]: unknown;
};

let {
  defaultOpen = false,
  open = $bindable(),
  onOpenChange,
  disabled = false,
  animation,
  children,
  class: className,
  ...rest
}: Props = $props();

let uncontrolledOpen = $state(untrack(() => defaultOpen));
const instanceId = crypto.randomUUID();

const resolvedAnimation = $derived(normalizeAnimationConfig(animation));

const resolvedOpen = $derived(
  open !== undefined ? Boolean(open) : uncontrolledOpen,
);

const triggerId = `collapsible-trigger-${instanceId}`;
const contentId = `collapsible-content-${instanceId}`;

function setOpen(next: boolean) {
  if (open !== undefined) {
    open = next;
  } else {
    uncontrolledOpen = next;
  }
  onOpenChange?.(next);
}

setCollapsibleContext({
  get open() {
    return resolvedOpen;
  },
  get disabled() {
    return disabled;
  },
  get animation() {
    return resolvedAnimation;
  },
  contentId,
  triggerId,
  setOpen,
});
</script>

<div
  {...rest}
  class={className}
  data-slot="collapsible"
  data-state={resolvedOpen ? "open" : "closed"}
  data-disabled={disabled ? "" : undefined}
>
  {@render children?.()}
</div>
