<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../dist/index.js";
</script>

<Collapsible defaultOpen animation={false}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
