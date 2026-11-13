<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";
</script>

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent
    class="panel-chrome"
    style="border-left: 3px solid red; padding: 12px"
  >
    Panel
  </CollapsibleContent>
</Collapsible>
