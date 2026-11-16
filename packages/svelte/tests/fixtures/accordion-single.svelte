<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../dist/index.js";

type Props = {
  collapsible?: boolean;
  defaultValue?: string | null;
};

let { collapsible = false, defaultValue }: Props = $props();
</script>

<Accordion type="single" {collapsible} {defaultValue} animation={false}>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
