<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";

type Props = {
  onOpenChange?: (open: boolean) => void;
};

let { onOpenChange }: Props = $props();
let open = $state(false);
</script>

<Collapsible
  bind:open
  animated={false}
  onOpenChange={(next) => {
    onOpenChange?.(next);
  }}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
