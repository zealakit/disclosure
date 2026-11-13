import { createContext, useContext } from "react";

export type CollapsibleContextValue = {
  open: boolean;
  disabled: boolean;
  animated: boolean;
  contentId: string;
  triggerId: string;
  setOpen: (open: boolean) => void;
};

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(
  null,
);

export function useCollapsibleContext(): CollapsibleContextValue {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      "Collapsible components must be used within a <Collapsible> root",
    );
  }
  return context;
}
