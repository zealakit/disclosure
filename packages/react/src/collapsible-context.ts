import { createContext, useContext } from "react";
import type { AnimationTimingFunction } from "./animation";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animated: boolean;
  animationTimingFunction: AnimationTimingFunction;
  animationDuration: number;
  animationDelay: number;
  contentId: string;
  triggerId: string;
  setOpen: (open: boolean) => void;
};

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(
  null,
);

export function useCollapsibleContext(): CollapsibleContextValue {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      "Collapsible components must be used within a <Collapsible> root",
    );
  }
  return context;
}
