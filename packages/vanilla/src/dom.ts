import { prefersReducedMotion } from "./styles";

let idCounter = 0;

export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function parseBooleanAttribute(
  element: Element,
  name: string,
  defaultValue = false,
): boolean {
  if (!element.hasAttribute(name)) {
    return defaultValue;
  }
  const value = element.getAttribute(name);
  if (value === null || value === "" || value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return defaultValue;
}

export function parseNumberAttribute(
  element: Element,
  name: string,
): number | undefined {
  const raw = element.getAttribute(name);
  if (raw == null || raw === "") {
    return undefined;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

export function setDataState(element: Element, open: boolean): void {
  element.setAttribute("data-state", open ? "open" : "closed");
}

export function setDisabledAttr(element: Element, disabled: boolean): void {
  if (disabled) {
    element.setAttribute("data-disabled", "");
  } else {
    element.removeAttribute("data-disabled");
  }
}

export function setInert(element: HTMLElement, inert: boolean): void {
  if (inert) {
    element.setAttribute("inert", "");
  } else {
    element.removeAttribute("inert");
  }
}

/**
 * Find descendants matching `selector` that belong to `owner` via `closestAttr`,
 * without descending into nested owners with the same attribute.
 */
export function queryOwned(
  owner: Element,
  closestAttr: string,
  selector: string,
): HTMLElement[] {
  return Array.from(owner.querySelectorAll<HTMLElement>(selector)).filter(
    (node) => node.closest(closestAttr) === owner,
  );
}

export function ensureContentWrapper(content: HTMLElement): HTMLElement {
  const existing = content.querySelector<HTMLElement>(
    ":scope > [data-collapsible-content-wrapper]",
  );
  if (existing) {
    return existing;
  }

  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-collapsible-content-wrapper", "");

  // Mirror framework packages: consumer chrome (class/style) lands on the
  // clipped inner wrapper, not the animated viewport.
  if (content.className) {
    wrapper.className = content.className;
    content.removeAttribute("class");
  }
  if (content.getAttribute("style")) {
    wrapper.setAttribute("style", content.getAttribute("style") ?? "");
    content.removeAttribute("style");
  }

  while (content.firstChild) {
    wrapper.appendChild(content.firstChild);
  }
  content.appendChild(wrapper);
  return wrapper;
}

export type PresenceController = {
  sync: (open: boolean) => void;
  destroy: () => void;
};

/**
 * Mirrors framework presence: keep content mounted through exit animation,
 * then detach from the DOM unless forceMount is set.
 */
export function createPresence(options: {
  content: HTMLElement;
  animated: boolean;
  forceMount: boolean;
  getOpen: () => boolean;
}): PresenceController {
  const { content, forceMount, getOpen } = options;
  let shouldAnimate = options.animated && !prefersReducedMotion();
  let present = getOpen();
  let frame = 0;
  // Use parentNode (not isConnected) so nested instances inside a detached
  // ancestor can still swap themselves for a placeholder comment.
  let placeholder: Comment | null = null;

  const applyDom = (): void => {
    setDataState(content, present);
    const wrapper = content.querySelector<HTMLElement>(
      "[data-collapsible-content-wrapper]",
    );
    if (wrapper) {
      setDataState(wrapper, present);
    }

    if (shouldAnimate) {
      content.setAttribute("data-animated", "");
    } else {
      content.removeAttribute("data-animated");
    }

    const hide = !present && !shouldAnimate;
    if (hide) {
      content.setAttribute("hidden", "");
    } else {
      content.removeAttribute("hidden");
    }

    setInert(content, !getOpen());
  };

  const attach = (): void => {
    if (!placeholder?.parentNode) {
      return;
    }
    placeholder.parentNode.insertBefore(content, placeholder);
    placeholder.remove();
    placeholder = null;
  };

  const detach = (): void => {
    if (forceMount || placeholder || !content.parentNode) {
      return;
    }
    placeholder = document.createComment("zealakit-disclosure-content");
    content.parentNode.insertBefore(placeholder, content);
    content.remove();
  };

  const onTransitionEnd = (event: TransitionEvent): void => {
    if (event.target !== content) {
      return;
    }
    if (event.propertyName && event.propertyName !== "grid-template-rows") {
      return;
    }
    if (!getOpen() && !forceMount) {
      detach();
    }
  };

  content.addEventListener("transitionend", onTransitionEnd);

  const sync = (open: boolean): void => {
    shouldAnimate = options.animated && !prefersReducedMotion();

    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }

    if (open) {
      attach();
      if (!shouldAnimate) {
        present = true;
        applyDom();
        return;
      }
      present = false;
      applyDom();
      frame = requestAnimationFrame(() => {
        present = true;
        applyDom();
        frame = 0;
      });
      return;
    }

    present = false;
    applyDom();

    if (!shouldAnimate || forceMount) {
      if (!forceMount) {
        detach();
      }
    }
  };

  const initiallyOpen = getOpen();
  if (!initiallyOpen && !forceMount) {
    detach();
  } else {
    applyDom();
  }

  return {
    sync,
    destroy: () => {
      if (frame) {
        cancelAnimationFrame(frame);
      }
      content.removeEventListener("transitionend", onTransitionEnd);
      const open = getOpen();
      if (placeholder?.parentNode) {
        // Restore author markup after destroy.
        attach();
      }
      content.removeAttribute("data-animated");
      content.removeAttribute("inert");
      content.style.removeProperty("--collapsible-animation-duration");
      content.style.removeProperty("--collapsible-animation-easing");
      content.style.removeProperty("--collapsible-animation-delay");
      // Keep closed panels hidden in the static HTML after teardown.
      if (!open && !forceMount) {
        content.setAttribute("hidden", "");
      } else {
        content.removeAttribute("hidden");
      }
    },
  };
}
