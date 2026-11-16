import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { AnimationSetting, CollapsibleAnimationProps } from "./animation";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation";

export type CollapsibleProps = HTMLAttributes<HTMLDivElement> &
  CollapsibleAnimationProps & {
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
     * Controlled open state.
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
    children?: ReactNode;
  };

export type CollapsibleTriggerProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
  };

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Keep content mounted while closed.
   * @default false
   */
  forceMount?: boolean;
  children?: ReactNode;
};
