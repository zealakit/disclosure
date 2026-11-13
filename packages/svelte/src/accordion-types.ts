type AccordionSharedProps = {
  /**
   * Whether items use the built-in height animation.
   * @default true
   */
  animated?: boolean;
  /**
   * Whether the entire accordion ignores user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional attributes forwarded to the root element.
   */
  [key: string]: unknown;
};

export type AccordionSingleProps = AccordionSharedProps & {
  type?: "single";
  /**
   * Controlled value. Use `bind:value` for two-way binding.
   */
  value?: string | null;
  defaultValue?: string | null;
  /**
   * Allow collapsing the open item in single mode.
   * @default false
   */
  collapsible?: boolean;
  onValueChange?: (value: string | null) => void;
};

export type AccordionMultipleProps = AccordionSharedProps & {
  type: "multiple";
  /**
   * Controlled value. Use `bind:value` for two-way binding.
   */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export type AccordionItemProps = {
  value: string;
  disabled?: boolean;
  [key: string]: unknown;
};

export type AccordionTriggerProps = {
  disabled?: boolean;
  [key: string]: unknown;
};

export type AccordionContentProps = {
  /**
   * Keep content mounted while closed.
   * @default false
   */
  forceMount?: boolean;
  [key: string]: unknown;
};
