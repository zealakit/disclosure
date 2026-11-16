import assert from "node:assert/strict";
import { afterEach, describe, mock, test } from "node:test";
import AnimatedFixture from "./fixtures/animated.svelte";
import AnimationOptionFixture from "./fixtures/animation-option.svelte";
import BasicFixture from "./fixtures/basic.svelte";
import ContentChromeFixture from "./fixtures/content-chrome.svelte";
import ControlledFixture from "./fixtures/controlled.svelte";
import DisabledFixture from "./fixtures/disabled.svelte";
import ForceMountFixture from "./fixtures/force-mount.svelte";
import NestedFixture from "./fixtures/nested.svelte";
import MultipleFixture from "./fixtures/multiple.svelte";
import DefaultOpenFixture from "./fixtures/default-open.svelte";
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
  assertText,
  assertCalledWith,
} from "./support/dom.ts";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-svelte", () => {
  test("starts closed by default", () => {
    render(BasicFixture);
    const trigger = getByRole("button", { name: "Toggle" });
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(queryByText("Panel"), null);
  });

  test("starts open with defaultOpen", () => {
    render(DefaultOpenFixture);
    assertAttr(
      getByRole("button", { name: "Toggle" }),
      "aria-expanded",
      "true",
    );
    assertConnected(getByText("Panel"));
  });

  test("toggles uncontrolled state", async () => {
    render(BasicFixture);
    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    assertConnected(getByText("Panel"));

    await click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(queryByText("Panel"), null);
  });

  test("supports controlled open state", async () => {
    const onOpenChange = mock.fn();
    render(ControlledFixture, { props: { onOpenChange } });
    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    assertCalledWith(onOpenChange, true);
    assertAttr(trigger, "aria-expanded", "true");
  });

  test("does not toggle when disabled", async () => {
    render(DisabledFixture);
    const trigger = getByRole("button", { name: "Toggle" });
    assertDisabled(trigger);
    await click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(queryByText("Panel"), null);
  });

  test("forceMount keeps content in the DOM while hidden", async () => {
    render(ForceMountFixture);
    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    assertConnected(content);
    assertAttr(content, "hidden");
    assertAttr(content, "data-state", "closed");

    await click(getByRole("button", { name: "Toggle" }));
    assertNoAttr(content, "hidden");
    assertAttr(content, "data-state", "open");
  });

  test("sets aria relationship between trigger and content", () => {
    render(DefaultOpenFixture);
    const trigger = getByRole("button", { name: "Toggle" });
    const contentId = trigger.getAttribute("aria-controls");
    assert.ok(contentId);
    assertText(document.getElementById(contentId ?? ""), "Panel");
  });

  test("supports nested independent instances", async () => {
    render(NestedFixture);
    await click(getByRole("button", { name: "Outer" }));
    assertConnected(getByText("Outer panel", { exact: false }));
    assert.equal(queryByText("Inner panel"), null);

    await click(getByRole("button", { name: "Inner" }));
    assertConnected(getByText("Inner panel"));
  });

  test("exposes data-slot attributes for styling", () => {
    render(DefaultOpenFixture);
    assert.notEqual(document.querySelector('[data-slot="collapsible"]'), null);
    assert.notEqual(
      document.querySelector('[data-slot="collapsible-trigger"]'),
      null,
    );
    assert.notEqual(
      document.querySelector('[data-slot="collapsible-content"]'),
      null,
    );
  });

  test("keeps multiple roots independent", async () => {
    render(MultipleFixture);
    await click(getByRole("button", { name: "One" }));
    assertConnected(getByText("First"));
    assert.equal(queryByText("Second"), null);
  });

  test("animates by default and keeps content mounted while closing", async () => {
    render(AnimatedFixture);
    const trigger = getByRole("button", { name: "Toggle" });
    await click(trigger);
    await waitFor(() => {
      assertConnected(getByText("Panel"));
    });

    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    assertAttr(content, "data-animated");
    assertNoAttr(content, "hidden");
    assert.notEqual(
      content.querySelector("[data-collapsible-content-wrapper]"),
      null,
    );
    await waitFor(() => {
      assertAttr(content, "data-state", "open");
    });
    assertNoAttr(content, "inert");

    await click(trigger);
    assertConnected(getByText("Panel"));
    assertAttr(content, "data-state", "closed");
    assertAttr(content, "inert");

    await fireTransitionEnd(content, "grid-template-rows");
    await waitFor(() => {
      assert.equal(queryByText("Panel"), null);
    });
  });

  test("animation={false} unmounts immediately on close", async () => {
    render(DefaultOpenFixture);
    await click(getByRole("button", { name: "Toggle" }));
    assert.equal(queryByText("Panel"), null);
  });

  test("injects animation styles once", async () => {
    render(AnimatedFixture);
    render(AnimatedFixture);
    assert.equal(
      document.querySelectorAll("#zealakit-collapsible-styles").length,
      1,
    );
  });

  test("applies animation configuration CSS variables", () => {
    render(AnimationOptionFixture, {
      props: {
        animation: { easing: "linear", duration: 320, delay: 40 },
      },
    });

    const content = getByText("Panel").closest(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    assert.ok(
      (content.getAttribute("style") ?? "").includes(
        "--collapsible-animation-easing: linear",
      ),
    );
    assert.ok(
      (content.getAttribute("style") ?? "").includes(
        "--collapsible-animation-duration: 320ms",
      ),
    );
    assert.ok(
      (content.getAttribute("style") ?? "").includes(
        "--collapsible-animation-delay: 40ms",
      ),
    );
  });

  test("applies consumer chrome to the clipped content wrapper", async () => {
    render(ContentChromeFixture);
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

  test("ignores stale close transition after reopen", async () => {
    render(AnimatedFixture);
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
