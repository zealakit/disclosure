import type { InjectionKey } from "vue";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animated: boolean;
  contentId: string;
  triggerId: string;
  setOpen: (open: boolean) => void;
};

export const CollapsibleContextKey: InjectionKey<CollapsibleContextValue> =
  Symbol("zealakit-collapsible");
