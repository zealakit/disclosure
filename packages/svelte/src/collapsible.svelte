<script lang="ts">
import { untrack } from "svelte";
import {
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  type AnimationTimingFunction,
} from "./animation.js";
import { setCollapsibleContext } from "./collapsible-context.js";

type Props = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  animated?: boolean;
  animationTimingFunction?: AnimationTimingFunction;
  animationDuration?: number;
  animationDelay?: number;
  children?: import("svelte").Snippet;
  class?: string;
  [key: string]: unknown;
};

let {
  defaultOpen = false,
  open = $bindable(),
  onOpenChange,
  disabled = false,
  animated = true,
  animationTimingFunction = DEFAULT_ANIMATION_TIMING_FUNCTION,
  animationDuration = DEFAULT_ANIMATION_DURATION_MS,
  animationDelay = DEFAULT_ANIMATION_DELAY_MS,
  children,
  class: className,
  ...rest
}: Props = $props();

let uncontrolledOpen = $state(untrack(() => defaultOpen));
const instanceId = crypto.randomUUID();

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
  get animated() {
    return animated;
  },
  get animationTimingFunction() {
    return animationTimingFunction;
  },
  get animationDuration() {
    return animationDuration;
  },
  get animationDelay() {
    return animationDelay;
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
