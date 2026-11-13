<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/index.js";
</script>

<Accordion type="single" collapsible animated={false}>
  <AccordionItem value="locked" disabled>
    <AccordionTrigger>Locked</AccordionTrigger>
    <AccordionContent>Hidden</AccordionContent>
  </AccordionItem>
</Accordion>
