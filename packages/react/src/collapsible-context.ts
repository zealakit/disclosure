import { createContext, useContext } from "react";
import type { ResolvedAnimationConfig } from "./animation.js";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animation: ResolvedAnimationConfig;
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
