<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../dist/index.js";
</script>

<Accordion type="single" collapsible animation={false}>
  <AccordionItem value="outer">
    <AccordionTrigger>Outer</AccordionTrigger>
    <AccordionContent>
      Outer content
      <Accordion type="single" collapsible animation={false}>
        <AccordionItem value="inner">
          <AccordionTrigger>Inner</AccordionTrigger>
          <AccordionContent>Inner content</AccordionContent>
        </AccordionItem>
      </Accordion>
    </AccordionContent>
  </AccordionItem>
</Accordion>
