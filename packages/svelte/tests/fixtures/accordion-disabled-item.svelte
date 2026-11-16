<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../dist/index.js";
</script>

<Accordion type="single" collapsible animation={false}>
  <AccordionItem value="locked" disabled>
    <AccordionTrigger>Locked</AccordionTrigger>
    <AccordionContent>Hidden</AccordionContent>
  </AccordionItem>
</Accordion>
