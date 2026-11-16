import type { AnimationSetting, CollapsibleAnimationProps } from "./animation";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  CollapsibleAnimationProps,
  ResolvedAnimationConfig,
} from "./animation";

export type AccordionSingleProps = CollapsibleAnimationProps & {
  /**
   * Expand/collapse animation. `false` disables it; an object customises it.
   * @default true
   */
  animation?: AnimationSetting;
  type?: "single";
  value?: string | null;
  defaultValue?: string | null;
  /**
   * Allow collapsing the open item in single mode.
   * @default false
   */
  collapsible?: boolean;
  disabled?: boolean;
};

export type AccordionMultipleProps = CollapsibleAnimationProps & {
  /**
   * Expand/collapse animation. `false` disables it; an object customises it.
   * @default true
   */
  animation?: AnimationSetting;
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  disabled?: boolean;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = {
  value: string;
  disabled?: boolean;
};

export type AccordionTriggerProps = {
  disabled?: boolean;
};

export type AccordionContentProps = {
  forceMount?: boolean;
};
