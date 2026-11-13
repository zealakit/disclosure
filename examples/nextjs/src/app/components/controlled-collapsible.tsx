"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/disclosure-react";
import { useState } from "react";

export function ControlledCollapsible() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="state-line">
        Open: <strong>{String(open)}</strong>
      </p>
      <Collapsible className="demo" open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>Controlled panel</CollapsibleTrigger>
        <CollapsibleContent>
          Parent owns <code>open</code> via <code>onOpenChange</code>.
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
