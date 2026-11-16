import type { AnimationSetting } from "./animation.js";

export type {
  AnimationConfig,
  AnimationEasing,
  AnimationSetting,
  AnimationTimingFunction,
  ResolvedAnimationConfig,
} from "./animation.js";

export type AccordionSingleProps = {
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

export type AccordionMultipleProps = {
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
