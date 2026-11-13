import { getContext, setContext } from "svelte";
import type { AnimationTimingFunction } from "./animation.js";

export type CollapsibleContextValue = {
  get open(): boolean;
  get disabled(): boolean;
  get animated(): boolean;
  get animationTimingFunction(): AnimationTimingFunction;
  get animationDuration(): number;
  get animationDelay(): number;
  contentId: string;
  triggerId: string;
  setOpen: (open: boolean) => void;
};

const COLLAPSIBLE_CONTEXT = Symbol("zealakit-collapsible");

export function setCollapsibleContext(value: CollapsibleContextValue): void {
  setContext(COLLAPSIBLE_CONTEXT, value);
}

export function getCollapsibleContext(): CollapsibleContextValue {
  const context = getContext<CollapsibleContextValue | undefined>(
    COLLAPSIBLE_CONTEXT,
  );
  if (!context) {
    throw new Error(
      "Collapsible components must be used within a <Collapsible> root",
    );
  }
  return context;
}
