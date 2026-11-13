import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/disclosure-react";
import { useState } from "react";

export function App() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <main className="page">
      <h1>@zealakit/disclosure-react</h1>
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
        <h2>5. Animation configuration</h2>
        <div className="demo">
          <Collapsible animationTimingFunction="linear">
            <CollapsibleTrigger className="trigger">
              Linear easing
            </CollapsibleTrigger>
            <CollapsibleContent className="content">
              <code>animationTimingFunction=&quot;linear&quot;</code>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible animationDuration={400}>
            <CollapsibleTrigger className="trigger">
              Custom duration (400ms)
            </CollapsibleTrigger>
            <CollapsibleContent className="content">
              <code>animationDuration={"{400}"}</code>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible animationDelay={150}>
            <CollapsibleTrigger className="trigger">
              Custom delay (150ms)
            </CollapsibleTrigger>
            <CollapsibleContent className="content">
              <code>animationDelay={"{150}"}</code>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible animated={false}>
            <CollapsibleTrigger className="trigger">
              Animation off
            </CollapsibleTrigger>
            <CollapsibleContent className="content">
              No height transition (<code>animated=false</code>).
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>

      <section>
        <h2>6. Accordion single</h2>
        <Accordion
          type="single"
          collapsible
          className="demo"
          animationTimingFunction="ease-in-out"
          animationDuration={300}
          animationDelay={0}
        >
          <AccordionItem value="general">
            <AccordionTrigger className="trigger">General</AccordionTrigger>
            <AccordionContent className="content">
              General settings and preferences. Accordion root owns{" "}
              <code>animationDuration={"{300}"}</code>.
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

      <section>
        <h2>8. Long content</h2>
        <Collapsible className="demo">
          <CollapsibleTrigger className="trigger">
            Release notes
          </CollapsibleTrigger>
          <CollapsibleContent className="content">
            <p>
              Disclosure measures and animates the full content height, even
              when the panel is taller than a single line. Use this example to
              verify expand and collapse feel continuous from the first frame to
              a true zero height.
            </p>
            <p>
              The height transition should keep borders, padding, and
              backgrounds clipped inside the animated viewport. Rapid toggles
              and reopening mid-close should also stay stable without leftover
              chrome flashing at the end of the exit animation.
            </p>
            <ul>
              <li>
                Open and close repeatedly while watching the final frames.
              </li>
              <li>
                Confirm nested text, lists, and spacing collapse together.
              </li>
              <li>
                Check that reopening restores the full panel without jump.
              </li>
              <li>
                Prefer styling padding and borders on the content panel, not the
                animated viewport itself.
              </li>
            </ul>
            <p>
              Extra copy keeps the measured height intentionally large: access
              tokens rotate every ninety days, recovery keys should be stored
              offline, and audit logs retain request metadata for thirty days.
              When onboarding a new workspace, invite collaborators first, then
              attach billing, then enable production keys. If something fails
              mid-setup, collapse this panel, fix the issue, and expand again to
              continue from the same checklist.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </main>
  );
}
