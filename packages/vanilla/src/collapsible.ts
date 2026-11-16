import { normalizeAnimationConfig } from "./animation.js";
import {
  applyAnimationStyle,
  createPresence,
  ensureContentWrapper,
  nextId,
  parseBooleanAttribute,
  readAnimationSetting,
  queryOwned,
  setDataState,
  setDisabledAttr,
} from "./dom.js";
import { ensureCollapsibleStyles } from "./styles.js";

export type CollapsibleInstance = {
  root: HTMLElement;
  destroy: () => void;
};

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

  const animation = normalizeAnimationConfig(readAnimationSetting(root));
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

  applyAnimationStyle(content, animation);

  const presence = createPresence({
    content,
    animated: animation.enabled,
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
