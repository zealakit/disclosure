import type { DefineComponent } from "vue";
import AccordionComponent from "./accordion.vue";
import AccordionContentComponent from "./accordion-content.vue";
import AccordionItemComponent from "./accordion-item.vue";
import AccordionTriggerComponent from "./accordion-trigger.vue";
import type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "./accordion.types";
import CollapsibleComponent from "./collapsible.vue";
import CollapsibleContentComponent from "./collapsible-content.vue";
import CollapsibleTriggerComponent from "./collapsible-trigger.vue";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "./collapsible.types";

export const Collapsible =
  CollapsibleComponent as DefineComponent<CollapsibleProps>;
export const CollapsibleTrigger =
  CollapsibleTriggerComponent as DefineComponent<CollapsibleTriggerProps>;
export const CollapsibleContent =
  CollapsibleContentComponent as DefineComponent<CollapsibleContentProps>;

export const Accordion = AccordionComponent as DefineComponent<AccordionProps>;
export const AccordionItem =
  AccordionItemComponent as DefineComponent<AccordionItemProps>;
export const AccordionTrigger =
  AccordionTriggerComponent as DefineComponent<AccordionTriggerProps>;
export const AccordionContent =
  AccordionContentComponent as DefineComponent<AccordionContentProps>;

export type {
  AccordionContentProps,
  AccordionItemProps,
  AccordionMultipleProps,
  AccordionProps,
  AccordionSingleProps,
  AccordionTriggerProps,
} from "./accordion.types";
export type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
} from "./collapsible.types";
export type { CollapsibleContextValue } from "./collapsible-context";
export { CollapsibleContextKey } from "./collapsible-context";
export type {
  AccordionContextValue,
  AccordionItemContextValue,
} from "./accordion-context";
export {
  AccordionContextKey,
  AccordionItemContextKey,
} from "./accordion-context";
