<script lang="ts">
import { untrack } from "svelte";
import {
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
  type AnimationTimingFunction,
} from "./animation.js";
import { setAccordionContext } from "./accordion-context.js";

type Props = {
  type?: "single" | "multiple";
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  collapsible?: boolean;
  animated?: boolean;
  animationTimingFunction?: AnimationTimingFunction;
  animationDuration?: number;
  animationDelay?: number;
  disabled?: boolean;
  onValueChange?: (value: never) => void;
  children?: import("svelte").Snippet;
  class?: string;
  [key: string]: unknown;
};

let {
  type = "single",
  value = $bindable(),
  defaultValue,
  collapsible = false,
  animated = true,
  animationTimingFunction = DEFAULT_ANIMATION_TIMING_FUNCTION,
  animationDuration = DEFAULT_ANIMATION_DURATION_MS,
  animationDelay = DEFAULT_ANIMATION_DELAY_MS,
  disabled = false,
  onValueChange,
  children,
  class: className,
  ...rest
}: Props = $props();

let uncontrolledSingle = $state<string | null>(
  untrack(() =>
    type === "single" && typeof defaultValue === "string" ? defaultValue : null,
  ),
);
let uncontrolledMultiple = $state<string[]>(
  untrack(() =>
    type === "multiple" && Array.isArray(defaultValue) ? [...defaultValue] : [],
  ),
);

const triggers = new Map<string, HTMLButtonElement>();

const isControlled = $derived(value !== undefined);
const resolvedCollapsible = $derived(type === "single" ? collapsible : false);

const singleValue = $derived<string | null>(
  type === "multiple"
    ? null
    : isControlled
      ? ((value as string | null | undefined) ?? null)
      : uncontrolledSingle,
);

const multipleValue = $derived<string[]>(
  type === "multiple"
    ? isControlled
      ? [...((value as string[] | null | undefined) ?? [])]
      : uncontrolledMultiple
    : [],
);

function emit(next: string | string[] | null) {
  (onValueChange as ((value: string | string[] | null) => void) | undefined)?.(
    next,
  );
}

function toggleItem(itemValue: string) {
  if (disabled) {
    return;
  }

  if (type === "multiple") {
    const exists = multipleValue.includes(itemValue);
    const next = exists
      ? multipleValue.filter((entry) => entry !== itemValue)
      : [...multipleValue, itemValue];
    if (isControlled) {
      value = next;
    } else {
      uncontrolledMultiple = next;
    }
    emit(next);
    return;
  }

  const isOpen = singleValue === itemValue;
  const next = isOpen ? (resolvedCollapsible ? null : singleValue) : itemValue;
  if (next === singleValue) {
    return;
  }
  if (isControlled) {
    value = next;
  } else {
    uncontrolledSingle = next;
  }
  emit(next);
}

setAccordionContext({
  get type() {
    return type;
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
  get disabled() {
    return disabled;
  },
  get collapsible() {
    return resolvedCollapsible;
  },
  isItemOpen(itemValue: string) {
    if (type === "multiple") {
      return multipleValue.includes(itemValue);
    }
    return singleValue === itemValue;
  },
  toggleItem,
  registerTrigger(itemValue: string, node: HTMLButtonElement | null) {
    if (node) {
      triggers.set(itemValue, node);
    } else {
      triggers.delete(itemValue);
    }
  },
  getEnabledTriggerValues() {
    return [...triggers.entries()]
      .filter(([, node]) => !node.disabled)
      .sort(([, a], [, b]) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      )
      .map(([itemValue]) => itemValue);
  },
  focusTrigger(itemValue: string) {
    triggers.get(itemValue)?.focus();
  },
});
</script>

<div
  {...rest}
  class={className}
  data-slot="accordion"
  data-orientation="vertical"
  data-disabled={disabled ? "" : undefined}
>
  {@render children?.()}
</div>
