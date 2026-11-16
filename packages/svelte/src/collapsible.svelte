<script lang="ts">
import { untrack } from "svelte";
import {
  resolveAnimationSetting,
  type AnimationSetting,
  type AnimationTimingFunction,
} from "./animation.js";
import { setCollapsibleContext } from "./collapsible-context.js";

type Props = {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  animation?: AnimationSetting;
  /** @deprecated Use `animation`. */
  animated?: boolean;
  /** @deprecated Use `animation`. */
  animationTimingFunction?: AnimationTimingFunction;
  /** @deprecated Use `animation`. */
  animationDuration?: number;
  /** @deprecated Use `animation`. */
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
  animation,
  animated,
  animationTimingFunction,
  animationDuration,
  animationDelay,
  children,
  class: className,
  ...rest
}: Props = $props();

let uncontrolledOpen = $state(untrack(() => defaultOpen));
const instanceId = crypto.randomUUID();

const resolvedAnimation = $derived(
  resolveAnimationSetting({
    animation,
    animated,
    animationTimingFunction,
    animationDuration,
    animationDelay,
  }),
);

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
  get animated() {
    return resolvedAnimation.enabled;
  },
  get animationTimingFunction() {
    return resolvedAnimation.easing as AnimationTimingFunction;
  },
  get animationDuration() {
    return resolvedAnimation.duration;
  },
  get animationDelay() {
    return resolvedAnimation.delay;
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
