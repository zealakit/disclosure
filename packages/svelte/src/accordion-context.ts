import { getContext, setContext } from "svelte";
import type { AnimationTimingFunction } from "./animation.js";

export type AccordionContextValue = {
  get type(): "single" | "multiple";
  get animated(): boolean;
  get animationTimingFunction(): AnimationTimingFunction;
  get animationDuration(): number;
  get animationDelay(): number;
  get disabled(): boolean;
  get collapsible(): boolean;
  isItemOpen: (value: string) => boolean;
  toggleItem: (value: string) => void;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  getEnabledTriggerValues: () => string[];
  focusTrigger: (value: string) => void;
};

export type AccordionItemContextValue = {
  get value(): string;
  get open(): boolean;
  get disabled(): boolean;
  contentId: string;
  triggerId: string;
};

const ACCORDION_CONTEXT = Symbol("zealakit-accordion");
const ACCORDION_ITEM_CONTEXT = Symbol("zealakit-accordion-item");

export function setAccordionContext(value: AccordionContextValue): void {
  setContext(ACCORDION_CONTEXT, value);
}

export function getAccordionContext(): AccordionContextValue {
  const context = getContext<AccordionContextValue | undefined>(
    ACCORDION_CONTEXT,
  );
  if (!context) {
    throw new Error("Accordion components must be used within an <Accordion>");
  }
  return context;
}

export function setAccordionItemContext(
  value: AccordionItemContextValue,
): void {
  setContext(ACCORDION_ITEM_CONTEXT, value);
}

export function getAccordionItemContext(): AccordionItemContextValue {
  const context = getContext<AccordionItemContextValue | undefined>(
    ACCORDION_ITEM_CONTEXT,
  );
  if (!context) {
    throw new Error(
      "AccordionItem parts must be used within an <AccordionItem>",
    );
  }
  return context;
}
