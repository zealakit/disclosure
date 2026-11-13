import type { CollapsibleAnimationProps } from "./animation";

export type {
  AnimationTimingFunction,
  CollapsibleAnimationProps,
} from "./animation";

export type AccordionSingleProps = CollapsibleAnimationProps & {
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
