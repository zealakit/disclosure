import { createContext, useContext, type RefObject } from "react";

export type AccordionContextValue = {
  type: "single" | "multiple";
  animated: boolean;
  disabled: boolean;
  collapsible: boolean;
  isItemOpen: (value: string) => boolean;
  toggleItem: (value: string) => void;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  getEnabledTriggerValues: () => string[];
  focusTrigger: (value: string) => void;
};

export type AccordionItemContextValue = {
  value: string;
  open: boolean;
  disabled: boolean;
  contentId: string;
  triggerId: string;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export const AccordionContext = createContext<AccordionContextValue | null>(
  null,
);

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an <Accordion>");
  }
  return context;
}

export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionItem parts must be used within an <AccordionItem>",
    );
  }
  return context;
}
