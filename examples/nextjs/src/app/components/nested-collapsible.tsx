"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/collapsible-react";

export function NestedCollapsible() {
  return (
    <Collapsible className="demo" defaultOpen>
      <CollapsibleTrigger>Outer</CollapsibleTrigger>
      <CollapsibleContent>
        Outer content
        <Collapsible className="demo nested">
          <CollapsibleTrigger>Inner</CollapsibleTrigger>
          <CollapsibleContent>Inner content</CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
}
