import {
  getCollapsibleAnimationStyle,
  resolveAnimationConfig,
  type AnimationTimingFunction,
  type CollapsibleAnimationProps,
} from "./animation";
import {
  createPresence,
  ensureContentWrapper,
  nextId,
  parseBooleanAttribute,
  parseNumberAttribute,
  queryOwned,
  setDataState,
  setDisabledAttr,
  type PresenceController,
} from "./dom";
import { ensureCollapsibleStyles } from "./styles";

export type AccordionInstance = {
  root: HTMLElement;
  destroy: () => void;
};

type AccordionItemState = {
  item: HTMLElement;
  value: string;
  disabled: boolean;
  trigger: HTMLButtonElement;
  content: HTMLElement;
  triggerId: string;
  contentId: string;
  presence: PresenceController;
  onClick: (event: Event) => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

function readAnimationProps(root: HTMLElement): CollapsibleAnimationProps {
  const timing = root.getAttribute("data-animation-timing-function");
  return {
    animated: parseBooleanAttribute(root, "data-animated", true),
    animationTimingFunction:
      timing === "linear" || timing === "ease-in-out"
        ? (timing as AnimationTimingFunction)
        : undefined,
    animationDuration: parseNumberAttribute(root, "data-animation-duration"),
    animationDelay: parseNumberAttribute(root, "data-animation-delay"),
  };
}

function parseDefaultValues(
  root: HTMLElement,
  type: "single" | "multiple",
): string | null | string[] {
  const raw =
    root.getAttribute("data-default-value") ??
    root.getAttribute("data-value") ??
    "";
  if (!raw) {
    return type === "multiple" ? [] : null;
  }
  if (type === "multiple") {
    return raw
      .split(/[\s,]+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return raw.trim() || null;
}

export function initAccordion(root: HTMLElement): AccordionInstance {
  ensureCollapsibleStyles();

  const typeAttr =
    root.getAttribute("data-accordion-type") ??
    root.getAttribute("data-type") ??
    "single";
  const type: "single" | "multiple" =
    typeAttr === "multiple" ? "multiple" : "single";
  const collapsible =
    type === "single"
      ? parseBooleanAttribute(root, "data-collapsible", false)
      : false;
  const rootDisabled = parseBooleanAttribute(root, "data-disabled", false);
  const animation = resolveAnimationConfig(readAnimationProps(root));

  let singleValue: string | null =
    type === "single"
      ? (parseDefaultValues(root, "single") as string | null)
      : null;
  let multipleValue: string[] =
    type === "multiple"
      ? [...(parseDefaultValues(root, "multiple") as string[])]
      : [];

  root.setAttribute("data-slot", "accordion");
  root.setAttribute("data-orientation", "vertical");
  setDisabledAttr(root, rootDisabled);

  const itemElements = queryOwned(
    root,
    "[data-accordion]",
    "[data-accordion-item]",
  );

  const items: AccordionItemState[] = [];
  const enabledOrder: string[] = [];

  const isItemOpen = (value: string): boolean => {
    if (type === "multiple") {
      return multipleValue.includes(value);
    }
    return singleValue === value;
  };

  const getEnabledTriggerValues = (): string[] =>
    enabledOrder.filter((value) => {
      const item = items.find((entry) => entry.value === value);
      return Boolean(item && !item.disabled && !item.trigger.disabled);
    });

  const focusTrigger = (value: string): void => {
    items.find((entry) => entry.value === value)?.trigger.focus();
  };

  const toggleItem = (value: string): void => {
    if (rootDisabled) {
      return;
    }
    const item = items.find((entry) => entry.value === value);
    if (!item || item.disabled) {
      return;
    }

    if (type === "multiple") {
      const exists = multipleValue.includes(value);
      multipleValue = exists
        ? multipleValue.filter((entry) => entry !== value)
        : [...multipleValue, value];
      applyAll();
      return;
    }

    const open = singleValue === value;
    const next = open ? (collapsible ? null : singleValue) : value;
    if (next === singleValue) {
      return;
    }
    singleValue = next;
    applyAll();
  };

  const applyItem = (item: AccordionItemState): void => {
    const open = isItemOpen(item.value);
    setDataState(item.item, open);
    setDataState(item.trigger, open);
    setDisabledAttr(item.item, item.disabled);
    setDisabledAttr(item.trigger, item.disabled);
    item.trigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (item.disabled) {
      item.trigger.setAttribute("disabled", "");
    } else {
      item.trigger.removeAttribute("disabled");
    }
    item.presence.sync(open);
  };

  const applyAll = (): void => {
    for (const item of items) {
      applyItem(item);
    }
  };

  for (const itemEl of itemElements) {
    const value = itemEl.getAttribute("data-value");
    if (!value) {
      continue;
    }

    const trigger = queryOwned(
      itemEl,
      "[data-accordion-item]",
      "[data-accordion-trigger]",
    )[0] as HTMLButtonElement | undefined;
    const content = queryOwned(
      itemEl,
      "[data-accordion-item]",
      "[data-accordion-content]",
    )[0];

    if (!trigger || !content) {
      continue;
    }

    const itemDisabled =
      rootDisabled || parseBooleanAttribute(itemEl, "data-disabled", false);
    const triggerId = trigger.id || nextId("accordion-trigger");
    const contentId = content.id || nextId("accordion-content");
    trigger.id = triggerId;
    content.id = contentId;

    itemEl.setAttribute("data-slot", "accordion-item");
    trigger.setAttribute("data-slot", "accordion-trigger");
    content.setAttribute("data-slot", "accordion-content");
    content.setAttribute("aria-labelledby", triggerId);
    trigger.setAttribute("type", trigger.getAttribute("type") ?? "button");
    trigger.setAttribute("aria-controls", contentId);

    // Prefer wrapping heading semantics when author used a bare button.
    if (
      trigger.parentElement &&
      !trigger.parentElement.hasAttribute("data-slot") &&
      /^H[1-6]$/.test(trigger.parentElement.tagName)
    ) {
      trigger.parentElement.setAttribute("data-slot", "accordion-heading");
    }

    if (trigger.tagName !== "BUTTON") {
      console.warn(
        '[@zealakit/disclosure-vanilla] Accordion triggers should be <button type="button"> elements.',
      );
    }

    ensureContentWrapper(content);

    const animationStyle = getCollapsibleAnimationStyle(animation);
    content.style.setProperty(
      "--collapsible-animation-duration",
      animationStyle["--collapsible-animation-duration"],
    );
    content.style.setProperty(
      "--collapsible-animation-easing",
      animationStyle["--collapsible-animation-easing"],
    );
    content.style.setProperty(
      "--collapsible-animation-delay",
      animationStyle["--collapsible-animation-delay"],
    );

    // Promote content element to section semantics when possible.
    if (content.tagName === "DIV") {
      content.setAttribute("role", "region");
    }

    const presence = createPresence({
      content,
      animated: animation.animated,
      forceMount: parseBooleanAttribute(content, "data-force-mount", false),
      getOpen: () => isItemOpen(value),
    });

    const onClick = (event: Event): void => {
      if (event.defaultPrevented || itemDisabled) {
        return;
      }
      toggleItem(value);
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.defaultPrevented || itemDisabled) {
        return;
      }

      const enabled = getEnabledTriggerValues();
      const currentIndex = enabled.indexOf(value);
      if (currentIndex === -1 || enabled.length === 0) {
        return;
      }

      const focusAt = (index: number): void => {
        const next = enabled[index];
        if (next) {
          event.preventDefault();
          focusTrigger(next);
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
    };

    trigger.addEventListener("click", onClick);
    trigger.addEventListener("keydown", onKeyDown);

    const state: AccordionItemState = {
      item: itemEl,
      value,
      disabled: itemDisabled,
      trigger,
      content,
      triggerId,
      contentId,
      presence,
      onClick,
      onKeyDown,
    };
    items.push(state);
    if (!itemDisabled) {
      enabledOrder.push(value);
    }
  }

  applyAll();

  return {
    root,
    destroy: () => {
      for (const item of items) {
        item.trigger.removeEventListener("click", item.onClick);
        item.trigger.removeEventListener("keydown", item.onKeyDown);
        item.presence.destroy();
        item.item.removeAttribute("data-slot");
        item.item.removeAttribute("data-state");
        item.item.removeAttribute("data-disabled");
        item.trigger.removeAttribute("data-slot");
        item.trigger.removeAttribute("data-state");
        item.trigger.removeAttribute("data-disabled");
        item.trigger.removeAttribute("aria-expanded");
        item.content.removeAttribute("data-slot");
        item.content.removeAttribute("data-state");
        item.content.removeAttribute("role");
        item.content.removeAttribute("aria-labelledby");
      }
      root.removeAttribute("data-slot");
      root.removeAttribute("data-orientation");
      root.removeAttribute("data-disabled");
    },
  };
}
