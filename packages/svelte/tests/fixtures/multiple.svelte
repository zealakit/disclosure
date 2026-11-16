<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../dist/index.js";
</script>

<Collapsible animation={false}>
  <CollapsibleTrigger>One</CollapsibleTrigger>
  <CollapsibleContent>First</CollapsibleContent>
</Collapsible>
<Collapsible animation={false}>
  <CollapsibleTrigger>Two</CollapsibleTrigger>
  <CollapsibleContent>Second</CollapsibleContent>
</Collapsible>
