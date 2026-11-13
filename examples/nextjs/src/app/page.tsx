import { BasicAccordion } from "./components/basic-accordion";
import { BasicCollapsible } from "./components/basic-collapsible";
import { ControlledCollapsible } from "./components/controlled-collapsible";
import { DisabledCollapsible } from "./components/disabled-collapsible";
import { NestedCollapsible } from "./components/nested-collapsible";

export default function Page() {
  return (
    <main className="page">
      <h1>@zealakit/disclosure-react · Next.js</h1>
      <p className="lede">
        App Router integration example. This page and layout are Server
        Components. Interactive Collapsible demos are dedicated Client
        Components.
      </p>

      <p className="note">
        The library does not ship a <code>&quot;use client&quot;</code>{" "}
        directive. Mark the leaf components that call hooks or handle events in
        your app.
      </p>

      <section>
        <h2>1. Basic uncontrolled</h2>
        <p className="section-copy">
          Server Component page imports a Client Component that uses{" "}
          <code>defaultOpen</code>.
        </p>
        <BasicCollapsible />
      </section>

      <section>
        <h2>2. Controlled</h2>
        <p className="section-copy">
          Client state stays outside the Collapsible via <code>open</code> /{" "}
          <code>onOpenChange</code>.
        </p>
        <ControlledCollapsible />
      </section>

      <section>
        <h2>3. Disabled</h2>
        <p className="section-copy">
          Root <code>disabled</code> blocks interaction and styles the trigger.
        </p>
        <DisabledCollapsible />
      </section>

      <section>
        <h2>4. Nested</h2>
        <p className="section-copy">
          Nested instances keep independent open state.
        </p>
        <NestedCollapsible />
      </section>

      <section>
        <h2>5. Accordion</h2>
        <p className="section-copy">
          Single-mode Accordion with default height animation.
        </p>
        <BasicAccordion />
      </section>
    </main>
  );
}
