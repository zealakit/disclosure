<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/index.js";

type Props = {
  collapsible?: boolean;
  defaultValue?: string | null;
};

let { collapsible = false, defaultValue }: Props = $props();
</script>

<Accordion type="single" {collapsible} {defaultValue} animated={false}>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
