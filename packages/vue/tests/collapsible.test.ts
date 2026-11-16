import { defineComponent, ref } from "vue";
import assert from "node:assert/strict";
import { afterEach, describe, mock, test } from "node:test";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../dist/index.js";
import {
  render,
  cleanup,
  getByRole,
  getByText,
  queryByText,
  waitFor,
  click,
  fireTransitionEnd,
  assertAttr,
  assertNoAttr,
  assertDisabled,
  assertConnected,
  assertCalledWith,
} from "./support/dom.ts";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-vue", () => {
  test("starts closed by default", () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    assertAttr(
      getByRole("button", { name: "Toggle" }),
      "aria-expanded",
      "false",
    );
    assert.equal(queryByText("Panel"), null);
  });

  test("toggles uncontrolled state", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    assertConnected(getByText("Panel"));

    await click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(queryByText("Panel"), null);
  });

  test("supports controlled open via v-model:open", async () => {
    const onOpenChange = mock.fn();
    const Controlled = defineComponent({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      setup() {
        const open = ref(false);
        return { open, onOpenChange };
      },
      template: `
        <Collapsible v-model:open="open" :animation="false" @open-change="onOpenChange">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    render(Controlled);
    await click(getByRole("button", { name: "Toggle" }));
    assertCalledWith(onOpenChange, true);
  });

  test("does not toggle when disabled", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible disabled :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    assertDisabled(trigger);
    assert.equal(queryByText("Panel"), null);
  });

  test("animates by default and keeps content mounted while closing", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    await click(getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertConnected(getByText("Panel"));
    });

    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    );
    assertAttr(content, "data-animated");

    await click(getByRole("button", { name: "Toggle" }));
    assertConnected(getByText("Panel"));
    assertAttr(content, "data-state", "closed");

    await fireTransitionEnd(content as HTMLElement, "grid-template-rows");
    await waitFor(() => {
      assert.equal(queryByText("Panel"), null);
    });
  });

  test("forceMount keeps content mounted", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent force-mount>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    );
    assertAttr(content, "hidden");
    await click(getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertNoAttr(content, "hidden");
    });
  });

  test("applies consumer chrome to the clipped content wrapper", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent class="panel-chrome" style="border-left: 3px solid red; padding: 12px">
            Panel
          </CollapsibleContent>
        </Collapsible>
      `,
    });

    await click(getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertConnected(getByText("Panel"));
    });

    const viewport = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    const wrapper = viewport.querySelector(
      "[data-collapsible-content-wrapper]",
    ) as HTMLElement;

    assertAttr(viewport, "data-animated");
    assert.ok(!viewport.className.includes("panel-chrome"));
    assert.ok(wrapper.className.includes("panel-chrome"));
    assert.ok((wrapper.getAttribute("style") ?? "").includes("border-left"));
  });

  test("applies animation configuration CSS variables", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible
          :default-open="true"
          :animation="{ easing: 'linear', duration: 320, delay: 40 }"
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-easing"),
      "linear",
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-duration"),
      "320ms",
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-delay"),
      "40ms",
    );
  });

  test("ignores stale close transition after reopen", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    await waitFor(() => {
      assertConnected(getByText("Panel"));
    });

    const viewport = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;

    await click(trigger);
    assertAttr(viewport, "data-state", "closed");

    await click(trigger);
    await waitFor(() => {
      assertAttr(viewport, "data-state", "open");
    });

    await fireTransitionEnd(viewport, "grid-template-rows");
    assertConnected(getByText("Panel"));
  });
});
