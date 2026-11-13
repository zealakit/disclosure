import { getContext, setContext } from "svelte";

export type CollapsibleContextValue = {
  get open(): boolean;
  get disabled(): boolean;
  get animated(): boolean;
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
