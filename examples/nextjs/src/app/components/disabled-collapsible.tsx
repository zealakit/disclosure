"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/collapsible-react";

export function DisabledCollapsible() {
  return (
    <Collapsible className="demo" disabled>
      <CollapsibleTrigger>Disabled trigger</CollapsibleTrigger>
      <CollapsibleContent>
        You should not see this after clicking.
      </CollapsibleContent>
    </Collapsible>
  );
}
