<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  type AnimationSetting,
} from "../../src/index.js";

type Props = {
  animation?: AnimationSetting;
  animationDuration?: number;
  animated?: boolean;
};

let { animation, animationDuration, animated }: Props = $props();
</script>

<Collapsible defaultOpen {animation} {animationDuration} {animated}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
