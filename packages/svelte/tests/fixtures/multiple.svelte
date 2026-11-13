<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";
</script>

<Collapsible animated={false}>
  <CollapsibleTrigger>One</CollapsibleTrigger>
  <CollapsibleContent>First</CollapsibleContent>
</Collapsible>
<Collapsible animated={false}>
  <CollapsibleTrigger>Two</CollapsibleTrigger>
  <CollapsibleContent>Second</CollapsibleContent>
</Collapsible>
