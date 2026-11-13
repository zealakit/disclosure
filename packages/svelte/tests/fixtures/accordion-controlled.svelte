<script lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/index.js";

type Props = {
  onValueChange?: (value: string | null) => void;
};

let { onValueChange }: Props = $props();
let value = $state<string | null>(null);
</script>

<Accordion
  type="single"
  collapsible
  animated={false}
  bind:value
  onValueChange={(next: string | null) => {
    onValueChange?.(next);
  }}
>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
</Accordion>
