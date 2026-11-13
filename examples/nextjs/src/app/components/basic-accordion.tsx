"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@zealakit/collapsible-react";

export function BasicAccordion() {
  return (
    <Accordion type="single" collapsible className="demo">
      <AccordionItem value="general">
        <AccordionTrigger className="trigger">General</AccordionTrigger>
        <AccordionContent className="content">
          General settings and preferences.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger className="trigger">Advanced</AccordionTrigger>
        <AccordionContent className="content">
          Advanced configuration options.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
