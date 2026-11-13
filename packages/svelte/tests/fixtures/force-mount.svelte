<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";
</script>

<Collapsible animated={false}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent forceMount>Panel</CollapsibleContent>
</Collapsible>
