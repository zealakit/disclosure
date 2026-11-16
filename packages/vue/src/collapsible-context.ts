import type { InjectionKey } from "vue";
import type { ResolvedAnimationConfig } from "./animation.js";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animation: ResolvedAnimationConfig;
  contentId: string;
  triggerId: string;
  setOpen: (open: boolean) => void;
};

export const CollapsibleContextKey: InjectionKey<CollapsibleContextValue> =
  Symbol("zealakit-collapsible");
