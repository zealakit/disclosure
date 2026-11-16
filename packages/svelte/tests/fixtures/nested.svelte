<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../dist/index.js";
</script>

<Collapsible animation={false}>
  <CollapsibleTrigger>Outer</CollapsibleTrigger>
  <CollapsibleContent>
    Outer panel
    <Collapsible animation={false}>
      <CollapsibleTrigger>Inner</CollapsibleTrigger>
      <CollapsibleContent>Inner panel</CollapsibleContent>
    </Collapsible>
  </CollapsibleContent>
</Collapsible>
