import type {
  AnimationSetting,
  CollapsibleAnimationProps,
} from "./animation.js";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation.js";

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
   * Controlled open state. Use `bind:open` for two-way binding.
   */
  open?: boolean;
  /**
   * Called when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether user interaction is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional attributes forwarded to the root element.
   */
  [key: string]: unknown;
};

export type CollapsibleTriggerProps = {
  disabled?: boolean;
  [key: string]: unknown;
};

export type CollapsibleContentProps = {
  /**
   * Keep content mounted while closed. When closed, content remains in the
   * DOM (with `inert`, and `hidden` when not animated).
   * @default false
   */
  forceMount?: boolean;
  [key: string]: unknown;
};
