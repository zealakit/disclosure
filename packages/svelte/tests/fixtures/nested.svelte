<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";
</script>

<Collapsible animated={false}>
  <CollapsibleTrigger>Outer</CollapsibleTrigger>
  <CollapsibleContent>
    Outer panel
    <Collapsible animated={false}>
      <CollapsibleTrigger>Inner</CollapsibleTrigger>
      <CollapsibleContent>Inner panel</CollapsibleContent>
    </Collapsible>
  </CollapsibleContent>
</Collapsible>
