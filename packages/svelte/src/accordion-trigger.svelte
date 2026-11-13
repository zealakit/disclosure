<script lang="ts">
import {
  getAccordionContext,
  getAccordionItemContext,
} from "./accordion-context.js";

type Props = {
  disabled?: boolean;
  children?: import("svelte").Snippet;
  class?: string;
  id?: string;
  onclick?: (event: MouseEvent) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  [key: string]: unknown;
};

let {
  disabled: disabledProp,
  children,
  class: className,
  id,
  onclick,
  onkeydown,
  ...rest
}: Props = $props();

const accordion = getAccordionContext();
const item = getAccordionItemContext();

const isDisabled = $derived(disabledProp ?? item.disabled);

let node = $state<HTMLButtonElement | null>(null);

$effect(() => {
  const element = node;
  if (!element || isDisabled) {
    return;
  }
  const itemValue = item.value;
  accordion.registerTrigger(itemValue, element);
  return () => {
    accordion.registerTrigger(itemValue, null);
  };
});

function handleClick(event: MouseEvent) {
  onclick?.(event);
  if (event.defaultPrevented || isDisabled) {
    return;
  }
  accordion.toggleItem(item.value);
}

function handleKeyDown(event: KeyboardEvent) {
  onkeydown?.(event);
  if (event.defaultPrevented || isDisabled) {
    return;
  }

  const enabled = accordion.getEnabledTriggerValues();
  const currentIndex = enabled.indexOf(item.value);
  if (currentIndex === -1 || enabled.length === 0) {
    return;
  }

  const focusAt = (index: number) => {
    const next = enabled[index];
    if (next) {
      event.preventDefault();
      accordion.focusTrigger(next);
    }
  };

  switch (event.key) {
    case "ArrowDown":
      focusAt((currentIndex + 1) % enabled.length);
      break;
    case "ArrowUp":
      focusAt((currentIndex - 1 + enabled.length) % enabled.length);
      break;
    case "Home":
      focusAt(0);
      break;
    case "End":
      focusAt(enabled.length - 1);
      break;
    default:
      break;
  }
}
</script>

<h3 data-slot="accordion-heading">
  <button
    type="button"
    {...rest}
    bind:this={node}
    id={id ?? item.triggerId}
    class={className}
    aria-expanded={item.open}
    aria-controls={item.contentId}
    disabled={isDisabled}
    data-slot="accordion-trigger"
    data-state={item.open ? "open" : "closed"}
    data-disabled={isDisabled ? "" : undefined}
    onclick={handleClick}
    onkeydown={handleKeyDown}
  >
    {@render children?.()}
  </button>
</h3>
