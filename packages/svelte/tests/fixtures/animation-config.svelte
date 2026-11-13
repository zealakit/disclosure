<script lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../src/index.js";

type Props = {
  animationTimingFunction?: "linear" | "ease-in-out";
  animationDuration?: number;
  animationDelay?: number;
  animated?: boolean;
};

let {
  animationTimingFunction = "ease-in-out",
  animationDuration = 200,
  animationDelay = 0,
  animated = true,
}: Props = $props();
</script>

<Collapsible
  defaultOpen
  {animated}
  {animationTimingFunction}
  {animationDuration}
  {animationDelay}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Panel</CollapsibleContent>
</Collapsible>
