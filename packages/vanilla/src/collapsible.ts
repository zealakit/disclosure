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
} from "./dom";
import { ensureCollapsibleStyles } from "./styles";

export type CollapsibleInstance = {
  root: HTMLElement;
  destroy: () => void;
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

export function initCollapsible(root: HTMLElement): CollapsibleInstance {
  ensureCollapsibleStyles();

  const trigger = queryOwned(
    root,
    "[data-disclosure]",
    "[data-disclosure-trigger]",
  )[0];
  const content = queryOwned(
    root,
    "[data-disclosure]",
    "[data-disclosure-content]",
  )[0];

  if (!trigger || !content) {
    return {
      root,
      destroy: () => {},
    };
  }

  const animation = resolveAnimationConfig(readAnimationProps(root));
  const disabled = parseBooleanAttribute(root, "data-disabled", false);
  const forceMount = parseBooleanAttribute(content, "data-force-mount", false);
  let open = parseBooleanAttribute(root, "data-default-open", false);

  const triggerId = trigger.id || nextId("collapsible-trigger");
  const contentId = content.id || nextId("collapsible-content");
  trigger.id = triggerId;
  content.id = contentId;

  if (trigger.tagName !== "BUTTON") {
    console.warn(
      '[@zealakit/disclosure-vanilla] Collapsible triggers should be <button type="button"> elements.',
    );
  }

  root.setAttribute("data-slot", "collapsible");
  trigger.setAttribute("data-slot", "collapsible-trigger");
  content.setAttribute("data-slot", "collapsible-content");
  trigger.setAttribute("type", trigger.getAttribute("type") ?? "button");
  trigger.setAttribute("aria-controls", contentId);
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

  const presence = createPresence({
    content,
    animated: animation.animated,
    forceMount,
    getOpen: () => open,
  });

  const apply = (): void => {
    setDataState(root, open);
    setDataState(trigger, open);
    setDisabledAttr(root, disabled);
    setDisabledAttr(trigger, disabled);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (disabled) {
      trigger.setAttribute("disabled", "");
    } else {
      trigger.removeAttribute("disabled");
    }
    presence.sync(open);
  };

  const onClick = (event: Event): void => {
    if (event.defaultPrevented || disabled) {
      return;
    }
    open = !open;
    apply();
  };

  trigger.addEventListener("click", onClick);
  apply();

  return {
    root,
    destroy: () => {
      trigger.removeEventListener("click", onClick);
      presence.destroy();
      root.removeAttribute("data-slot");
      root.removeAttribute("data-state");
      root.removeAttribute("data-disabled");
      trigger.removeAttribute("data-slot");
      trigger.removeAttribute("data-state");
      trigger.removeAttribute("data-disabled");
      trigger.removeAttribute("aria-expanded");
      // Keep author-provided aria-controls / ids.
      content.removeAttribute("data-slot");
      content.removeAttribute("data-state");
    },
  };
}
