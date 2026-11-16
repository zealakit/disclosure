import type { AnimationSetting, CollapsibleAnimationProps } from "./animation";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation";

export type CollapsibleProps = CollapsibleAnimationProps & {
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
