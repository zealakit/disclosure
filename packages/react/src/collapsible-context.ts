import { createContext, useContext } from "react";
import type {
  AnimationTimingFunction,
  ResolvedAnimationConfig,
} from "./animation";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animation: ResolvedAnimationConfig;
  /** @deprecated Use `animation.enabled`. */
  animated: boolean;
  /** @deprecated Use `animation.easing`. */
  animationTimingFunction: AnimationTimingFunction;
  /** @deprecated Use `animation.duration`. */
  animationDuration: number;
  /** @deprecated Use `animation.delay`. */
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
