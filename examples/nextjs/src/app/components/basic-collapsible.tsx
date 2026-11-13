"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/collapsible-react";

export function BasicCollapsible() {
  return (
    <Collapsible className="demo" defaultOpen={false}>
      <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
      <CollapsibleContent>
        alien-bean-pasta · wild-irish-burrito · horse-battery-staple
      </CollapsibleContent>
    </Collapsible>
  );
}
