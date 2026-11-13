<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@zealakit/disclosure-vue";
import { ref } from "vue";

const controlledOpen = ref(false);
</script>

<template>
  <main class="page">
    <h1>@zealakit/disclosure-vue</h1>
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
        Open: <strong>{{ controlledOpen }}</strong>
      </p>
      <Collapsible v-model:open="controlledOpen" class="demo">
        <CollapsibleTrigger class="trigger">Controlled panel</CollapsibleTrigger>
        <CollapsibleContent class="content">
          Parent owns <code>open</code> via <code>v-model:open</code>.
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
      <Collapsible class="demo" :default-open="true">
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
      <h2>5. Animation configuration</h2>
      <div class="demo">
        <Collapsible animation-timing-function="linear">
          <CollapsibleTrigger class="trigger">Linear easing</CollapsibleTrigger>
          <CollapsibleContent class="content">
            <code>animation-timing-function="linear"</code>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible :animation-duration="400">
          <CollapsibleTrigger class="trigger">
            Custom duration (400ms)
          </CollapsibleTrigger>
          <CollapsibleContent class="content">
            <code>:animation-duration="400"</code>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible :animation-delay="150">
          <CollapsibleTrigger class="trigger">
            Custom delay (150ms)
          </CollapsibleTrigger>
          <CollapsibleContent class="content">
            <code>:animation-delay="150"</code>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible :animated="false">
          <CollapsibleTrigger class="trigger">Animation off</CollapsibleTrigger>
          <CollapsibleContent class="content">
            No height transition.
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>

    <section>
      <h2>6. Accordion single</h2>
      <Accordion
        type="single"
        collapsible
        class="demo"
        animation-timing-function="ease-in-out"
        :animation-duration="300"
        :animation-delay="0"
      >
        <AccordionItem value="general">
          <AccordionTrigger class="trigger">General</AccordionTrigger>
          <AccordionContent class="content">
            General settings and preferences. Accordion root owns
            <code>:animation-duration="300"</code>.
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
      <Accordion type="multiple" class="demo" :default-value="['a']">
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

    <section>
      <h2>8. Long content</h2>
      <Collapsible class="demo">
        <CollapsibleTrigger class="trigger">Release notes</CollapsibleTrigger>
        <CollapsibleContent class="content">
          <p>
            Disclosure measures and animates the full content height, even when
            the panel is taller than a single line. Use this example to verify
            expand and collapse feel continuous from the first frame to a true
            zero height.
          </p>
          <p>
            The height transition should keep borders, padding, and backgrounds
            clipped inside the animated viewport. Rapid toggles and reopening
            mid-close should also stay stable without leftover chrome flashing
            at the end of the exit animation.
          </p>
          <ul>
            <li>Open and close repeatedly while watching the final frames.</li>
            <li>Confirm nested text, lists, and spacing collapse together.</li>
            <li>Check that reopening restores the full panel without jump.</li>
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
</template>
