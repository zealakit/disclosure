<script lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@zealakit/collapsible-svelte";

  let controlledOpen = $state(false);
</script>

<main class="page">
  <h1>@zealakit/collapsible-svelte</h1>
  <p class="lede">
    Headless Collapsible and Accordion examples. Height animation is on by
    default.
  </p>

  <section>
    <h2>1. Basic uncontrolled</h2>
    <Collapsible class="demo">
      <CollapsibleTrigger class="trigger">Recovery keys</CollapsibleTrigger>
      <CollapsibleContent class="content">
        alien-bean-pasta · wild-irish-burrito · horse-battery-staple
      </CollapsibleContent>
    </Collapsible>
  </section>

  <section>
    <h2>2. Controlled</h2>
    <p>
      Open: <strong>{String(controlledOpen)}</strong>
    </p>
    <Collapsible class="demo" bind:open={controlledOpen}>
      <CollapsibleTrigger class="trigger">Controlled panel</CollapsibleTrigger>
      <CollapsibleContent class="content">
        Parent owns <code>open</code> via <code>bind:open</code>.
      </CollapsibleContent>
    </Collapsible>
  </section>

  <section>
    <h2>3. Disabled</h2>
    <Collapsible class="demo" disabled>
      <CollapsibleTrigger class="trigger">Disabled trigger</CollapsibleTrigger>
      <CollapsibleContent class="content">
        You should not see this after clicking.
      </CollapsibleContent>
    </Collapsible>
  </section>

  <section>
    <h2>4. Nested</h2>
    <Collapsible class="demo" defaultOpen>
      <CollapsibleTrigger class="trigger">Outer</CollapsibleTrigger>
      <CollapsibleContent class="content">
        Outer content
        <Collapsible class="demo nested">
          <CollapsibleTrigger class="trigger">Inner</CollapsibleTrigger>
          <CollapsibleContent class="content">Inner content</CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  </section>

  <section>
    <h2>5. Animation off</h2>
    <Collapsible class="demo" animated={false}>
      <CollapsibleTrigger class="trigger">Instant toggle</CollapsibleTrigger>
      <CollapsibleContent class="content">No height transition.</CollapsibleContent>
    </Collapsible>
  </section>

  <section>
    <h2>6. Accordion single</h2>
    <Accordion type="single" collapsible class="demo">
      <AccordionItem value="general">
        <AccordionTrigger class="trigger">General</AccordionTrigger>
        <AccordionContent class="content">
          General settings and preferences.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger class="trigger">Advanced</AccordionTrigger>
        <AccordionContent class="content">
          Advanced configuration options.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>

  <section>
    <h2>7. Accordion multiple</h2>
    <Accordion type="multiple" class="demo" defaultValue={["a"]}>
      <AccordionItem value="a">
        <AccordionTrigger class="trigger">Alpha</AccordionTrigger>
        <AccordionContent class="content">Alpha panel</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger class="trigger">Beta</AccordionTrigger>
        <AccordionContent class="content">Beta panel</AccordionContent>
      </AccordionItem>
    </Accordion>
  </section>
</main>
