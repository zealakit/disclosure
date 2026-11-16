import assert from "node:assert/strict";
import { afterEach, describe, mock, test } from "node:test";
import AccordionAnimatedFixture from "./fixtures/accordion-animated.svelte";
import AccordionControlledFixture from "./fixtures/accordion-controlled.svelte";
import AccordionDisabledItemFixture from "./fixtures/accordion-disabled-item.svelte";
import AccordionMultipleFixture from "./fixtures/accordion-multiple.svelte";
import AccordionNestedFixture from "./fixtures/accordion-nested.svelte";
import AccordionSingleFixture from "./fixtures/accordion-single.svelte";
import {
  render,
  cleanup,
  getByRole,
  getByText,
  queryByText,
  findByText,
  waitFor,
  click,
  fireTransitionEnd,
  keydown,
  assertAttr,
  assertFocused,
  assertDisabled,
  assertConnected,
  assertCalledWith,
  assertLastCalledWith,
} from "./support/dom.ts";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-svelte Accordion", () => {
  test("single mode opens one item and keeps it open when collapsible is false", async () => {
    render(AccordionSingleFixture);

    await click(getByRole("button", { name: "General" }));
    assertConnected(getByText("General content"));

    await click(getByRole("button", { name: "General" }));
    assertConnected(getByText("General content"));

    await click(getByRole("button", { name: "Advanced" }));
    assert.equal(queryByText("General content"), null);
    assertConnected(getByText("Advanced content"));
  });

  test("single mode collapsible closes the open item", async () => {
    render(AccordionSingleFixture, { props: { collapsible: true } });

    await click(getByRole("button", { name: "General" }));
    await click(getByRole("button", { name: "General" }));
    assert.equal(queryByText("General content"), null);
  });

  test("multiple mode keeps several items open", async () => {
    render(AccordionMultipleFixture);

    await click(getByRole("button", { name: "General" }));
    await click(getByRole("button", { name: "Advanced" }));
    assertConnected(getByText("General content"));
    assertConnected(getByText("Advanced content"));
  });

  test("supports controlled single value", async () => {
    const onValueChange = mock.fn();
    render(AccordionControlledFixture, { props: { onValueChange } });

    await click(getByRole("button", { name: "General" }));
    assertCalledWith(onValueChange, "general");
    assertConnected(getByText("General content"));

    await click(getByRole("button", { name: "General" }));
    assertLastCalledWith(onValueChange, null);
    assert.equal(queryByText("General content"), null);
  });

  test("disabled item does not open", async () => {
    render(AccordionDisabledItemFixture);

    const trigger = getByRole("button", { name: "Locked" });
    await click(trigger);
    assertDisabled(trigger);
    assert.equal(queryByText("Hidden"), null);
  });

  test("supports keyboard navigation with Home and End", async () => {
    render(AccordionSingleFixture);

    const general = getByRole("button", { name: "General" });
    const advanced = getByRole("button", { name: "Advanced" });
    general.focus();

    await keydown(general, "ArrowDown");
    assertFocused(advanced);

    await keydown(advanced, "ArrowDown");
    assertFocused(general);

    await keydown(general, "ArrowUp");
    assertFocused(advanced);

    await keydown(advanced, "Home");
    assertFocused(general);

    await keydown(general, "End");
    assertFocused(advanced);
  });

  test("exposes accordion accessibility relationships", () => {
    render(AccordionSingleFixture, { props: { defaultValue: "general" } });

    const trigger = getByRole("button", { name: "General" });
    assertAttr(trigger, "aria-expanded", "true");
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    assert.equal(panel?.tagName, "SECTION");
    assertAttr(panel, "aria-labelledby", trigger.id);
    assert.equal(
      trigger.closest('[data-slot="accordion-heading"]')?.tagName,
      "H3",
    );
  });

  test("supports nested accordions", async () => {
    render(AccordionNestedFixture);

    await click(getByRole("button", { name: "Outer" }));
    assertConnected(getByText("Outer content"));
    assert.equal(queryByText("Inner content"), null);

    await click(getByRole("button", { name: "Inner" }));
    assertConnected(getByText("Inner content"));
  });

  test("animates by default and unmounts after transitionend", async () => {
    render(AccordionAnimatedFixture);
    const trigger = getByRole("button", { name: "General" });

    await click(trigger);
    const content = (await findByText("General content")).closest(
      '[data-slot="accordion-content"]',
    ) as HTMLElement;
    assertAttr(content, "data-animated");
    await waitFor(() => {
      assertAttr(content, "data-state", "open");
    });

    await click(trigger);
    assertConnected(getByText("General content"));
    assertAttr(content, "data-state", "closed");
    assertAttr(content, "inert");

    await fireTransitionEnd(content, "grid-template-rows");
    await waitFor(() => {
      assert.equal(queryByText("General content"), null);
    });
  });
});
