import { initAccordion, type AccordionInstance } from "./accordion";
import { initCollapsible, type CollapsibleInstance } from "./collapsible";

export type CreateDisclosureOptions = {
  /**
   * Scope initialization to this subtree. Defaults to `document`.
   */
  root?: ParentNode | null;
};

export type DisclosureController = {
  /**
   * Tear down all managed instances and restore content nodes.
   */
  destroy: () => void;
  /**
   * Destroy current instances and re-scan the root for markup.
   * Use after dynamically inserting disclosure/accordion HTML.
   */
  refresh: () => void;
};

const initializedRoots = new WeakSet<Element>();

function resolveRoot(
  input?: CreateDisclosureOptions | ParentNode | null,
): ParentNode {
  if (input == null) {
    return document;
  }
  if (typeof input === "object" && "nodeType" in input) {
    return input;
  }
  return input.root ?? document;
}

function depthOf(element: Element): number {
  let depth = 0;
  let current: Element | null = element;
  while (current) {
    depth += 1;
    current = current.parentElement;
  }
  return depth;
}

function collectRoots(scope: ParentNode, selector: string): HTMLElement[] {
  const roots =
    scope instanceof Element && scope.matches(selector)
      ? [scope as HTMLElement]
      : Array.from(scope.querySelectorAll<HTMLElement>(selector));
  // Deepest first so nested instances can detach before ancestors do.
  return roots.sort((a, b) => depthOf(b) - depthOf(a));
}

function bindScope(scope: ParentNode): {
  collapsibles: CollapsibleInstance[];
  accordions: AccordionInstance[];
} {
  const collapsibles: CollapsibleInstance[] = [];
  const accordions: AccordionInstance[] = [];

  for (const root of collectRoots(scope, "[data-disclosure]")) {
    if (initializedRoots.has(root)) {
      continue;
    }
    initializedRoots.add(root);
    collapsibles.push(initCollapsible(root));
  }

  for (const root of collectRoots(scope, "[data-accordion]")) {
    if (initializedRoots.has(root)) {
      continue;
    }
    initializedRoots.add(root);
    accordions.push(initAccordion(root));
  }

  return { collapsibles, accordions };
}

/**
 * Initialize all `[data-disclosure]` and `[data-accordion]` trees under `root`.
 *
 * @example
 * ```ts
 * import { createDisclosure } from "@zealakit/disclosure-vanilla";
 *
 * const disclosure = createDisclosure();
 * // later…
 * disclosure.refresh();
 * disclosure.destroy();
 * ```
 */
export function createDisclosure(
  options?: CreateDisclosureOptions | ParentNode | null,
): DisclosureController {
  const scope = resolveRoot(options);
  let collapsibles: CollapsibleInstance[] = [];
  let accordions: AccordionInstance[] = [];
  let destroyed = false;

  const mount = (): void => {
    const bound = bindScope(scope);
    collapsibles = bound.collapsibles;
    accordions = bound.accordions;
  };

  const teardown = (): void => {
    for (const instance of collapsibles) {
      initializedRoots.delete(instance.root);
      instance.destroy();
    }
    for (const instance of accordions) {
      initializedRoots.delete(instance.root);
      instance.destroy();
    }
    collapsibles = [];
    accordions = [];
  };

  mount();

  return {
    refresh: () => {
      if (destroyed) {
        return;
      }
      teardown();
      mount();
    },
    destroy: () => {
      if (destroyed) {
        return;
      }
      destroyed = true;
      teardown();
    },
  };
}
