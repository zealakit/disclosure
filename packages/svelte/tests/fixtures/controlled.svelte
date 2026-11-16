<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../dist/index.js";

type Props = {
  onOpenChange?: (open: boolean) => void;
};

let { onOpenChange }: Props = $props();
let open = $state(false);
</script>

<Collapsible
  bind:open
  animation={false}
  onOpenChange={(next) => {
    onOpenChange?.(next);
  }}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
