<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  type AnimationSetting,
} from "../../dist/index.js";

type Props = {
  animation?: AnimationSetting;
};

let { animation }: Props = $props();
</script>

<Collapsible defaultOpen {animation}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
