export type CollapsibleProps = {
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
  /**
   * Whether expand/collapse uses the built-in height animation.
   * @default true
   */
  animated?: boolean;
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
