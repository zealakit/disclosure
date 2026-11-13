<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/index.js";
</script>

<Accordion type="multiple" animated={false}>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
