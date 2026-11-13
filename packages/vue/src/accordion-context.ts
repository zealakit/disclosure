import type { InjectionKey, Ref } from "vue";
import type { AnimationTimingFunction } from "./animation";

export type AccordionContextValue = {
  type: "single" | "multiple";
  animated: boolean;
  animationTimingFunction: AnimationTimingFunction;
  animationDuration: number;
  animationDelay: number;
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
  triggerEl: Ref<HTMLButtonElement | null>;
};

export const AccordionContextKey: InjectionKey<AccordionContextValue> =
  Symbol("zealakit-accordion");

export const AccordionItemContextKey: InjectionKey<AccordionItemContextValue> =
  Symbol("zealakit-accordion-item");
