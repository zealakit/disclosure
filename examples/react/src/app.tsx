import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/collapsible-react";
import { useState } from "react";

export function App() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <main className="page">
      <h1>@zealakit/collapsible-react</h1>
      <p className="lede">
        Headless Collapsible and Accordion examples. Height animation is on by
        default; style chrome with your own CSS and <code>data-*</code>{" "}
        attributes.
      </p>

      <section>
        <h2>1. Basic uncontrolled</h2>
        <Collapsible className="demo">
          <CollapsibleTrigger className="trigger">
            Recovery keys
          </CollapsibleTrigger>
          <CollapsibleContent className="content">
            alien-bean-pasta · wild-irish-burrito · horse-battery-staple
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section>
        <h2>2. Controlled</h2>
        <p>
          Open: <strong>{String(controlledOpen)}</strong>
        </p>
        <Collapsible
          className="demo"
          open={controlledOpen}
          onOpenChange={setControlledOpen}
        >
          <CollapsibleTrigger className="trigger">
            Controlled panel
          </CollapsibleTrigger>
          <CollapsibleContent className="content">
            Parent owns <code>open</code> via <code>onOpenChange</code>.
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section>
        <h2>3. Disabled</h2>
        <Collapsible className="demo" disabled>
          <CollapsibleTrigger className="trigger">
            Disabled trigger
          </CollapsibleTrigger>
          <CollapsibleContent className="content">
            You should not see this after clicking.
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section>
        <h2>4. Nested</h2>
        <Collapsible className="demo" defaultOpen>
          <CollapsibleTrigger className="trigger">Outer</CollapsibleTrigger>
          <CollapsibleContent className="content">
            Outer content
            <Collapsible className="demo nested">
              <CollapsibleTrigger className="trigger">Inner</CollapsibleTrigger>
              <CollapsibleContent className="content">
                Inner content
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section>
        <h2>5. Animation off</h2>
        <Collapsible className="demo" animated={false}>
          <CollapsibleTrigger className="trigger">
            Instant toggle
          </CollapsibleTrigger>
          <CollapsibleContent className="content">
            No height transition (<code>animated=false</code>).
          </CollapsibleContent>
        </Collapsible>
      </section>

      <section>
        <h2>6. Accordion single</h2>
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
      </section>

      <section>
        <h2>7. Accordion multiple</h2>
        <Accordion type="multiple" className="demo" defaultValue={["a"]}>
          <AccordionItem value="a">
            <AccordionTrigger className="trigger">Alpha</AccordionTrigger>
            <AccordionContent className="content">Alpha panel</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger className="trigger">Beta</AccordionTrigger>
            <AccordionContent className="content">Beta panel</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  );
}
