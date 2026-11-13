export type CollapsibleProps = {
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
   * Whether expand/collapse uses the built-in height animation.
   * @default true
   */
  animated?: boolean;
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
