import type { InjectionKey } from "vue";
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

export const CollapsibleContextKey: InjectionKey<CollapsibleContextValue> =
  Symbol("zealakit-collapsible");
