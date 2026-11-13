export type AccordionSingleProps = {
  type?: "single";
  value?: string | null;
  defaultValue?: string | null;
  /**
   * Allow collapsing the open item in single mode.
   * @default false
   */
  collapsible?: boolean;
  animated?: boolean;
  disabled?: boolean;
};

export type AccordionMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  animated?: boolean;
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
