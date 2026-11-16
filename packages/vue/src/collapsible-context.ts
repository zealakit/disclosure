import type { InjectionKey } from "vue";
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

export const CollapsibleContextKey: InjectionKey<CollapsibleContextValue> =
  Symbol("zealakit-collapsible");
