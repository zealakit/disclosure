import type { AnimationSetting } from "./animation.js";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  ResolvedAnimationConfig,
} from "./animation.js";

export type CollapsibleProps = {
  /**
   * Expand/collapse animation. `false` disables it; an object customises it.
   * @default true
   */
  animation?: AnimationSetting;
  /**
   * Whether the collapsible is initially open (uncontrolled).
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state. Prefer `v-model:open` in templates.
   */
  open?: boolean;
  /**
   * Whether user interaction is disabled.
   * @default false
   */
  disabled?: boolean;
};

export type CollapsibleTriggerProps = {
  disabled?: boolean;
};

export type CollapsibleContentProps = {
  /**
   * Keep content mounted while closed.
   * @default false
   */
  forceMount?: boolean;
};
