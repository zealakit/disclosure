import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import type { CollapsibleAnimationProps } from "./animation";

export type {
  AnimationTimingFunction,
  CollapsibleAnimationProps,
} from "./animation";

type AccordionSharedProps = CollapsibleAnimationProps & {
  /**
   * Whether the entire accordion ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  children?: ReactNode;
};

export type AccordionSingleProps = AccordionSharedProps &
  Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    type?: "single";
    value?: string | null;
    defaultValue?: string | null;
    /**
     * Allow collapsing the open item in single mode.
     * @default false
     */
    collapsible?: boolean;
    onValueChange?: (value: string | null) => void;
  };

export type AccordionMultipleProps = AccordionSharedProps &
  Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> & {
    type: "multiple";
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
  };

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
};

export type AccordionTriggerProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
  };

export type AccordionContentProps = HTMLAttributes<HTMLElement> & {
  forceMount?: boolean;
  children?: ReactNode;
};
