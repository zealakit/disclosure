import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState, createElement as h, Fragment } from "react";
import assert from "node:assert/strict";
import { afterEach, describe, mock, test } from "node:test";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../dist/index.js";
import {
  assertAttr,
  assertNoAttr,
  assertDisabled,
  assertConnected,
  assertText,
  assertClass,
  assertCalledWith,
} from "./support/dom.ts";
afterEach(() => {
  cleanup();
});
describe("@zealakit/disclosure-react", () => {
  test("starts closed by default", () => {
    render(
      h(
        Collapsible,
        { animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("starts open with defaultOpen", () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    assertAttr(
      screen.getByRole("button", { name: "Toggle" }),
      "aria-expanded",
      "true",
    );
    assertConnected(screen.getByText("Panel"));
  });
  test("toggles uncontrolled state", () => {
    render(
      h(
        Collapsible,
        { animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    assertConnected(screen.getByText("Panel"));
    fireEvent.click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("supports controlled open state", () => {
    const onOpenChange = mock.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return h(
        Collapsible,
        {
          animation: false,
          open: open,
          onOpenChange: (next: boolean) => {
            onOpenChange(next);
            setOpen(next);
          },
        },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      );
    }
    render(h(Controlled, null));
    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    assertCalledWith(onOpenChange, true);
    assertAttr(trigger, "aria-expanded", "true");
  });
  test("does not toggle when disabled", () => {
    render(
      h(
        Collapsible,
        { disabled: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    assertDisabled(trigger);
    fireEvent.click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("forceMount keeps content in the DOM while hidden", async () => {
    render(
      h(
        Collapsible,
        { animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, { forceMount: true }, "Panel"),
      ),
    );
    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    assertConnected(content);
    assertAttr(content, "hidden");
    assertAttr(content, "data-state", "closed");
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertNoAttr(content, "hidden");
      assertAttr(content, "data-state", "open");
    });
  });
  test("sets aria relationship between trigger and content", () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const contentId = trigger.getAttribute("aria-controls");
    assert.ok(contentId);
    assertText(document.getElementById(contentId ?? ""), "Panel");
  });
  test("supports nested independent instances", () => {
    render(
      h(
        Collapsible,
        { animation: false },
        h(CollapsibleTrigger, null, "Outer"),
        h(
          CollapsibleContent,
          null,
          "Outer panel",
          h(
            Collapsible,
            { animation: false },
            h(CollapsibleTrigger, null, "Inner"),
            h(CollapsibleContent, null, "Inner panel"),
          ),
        ),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    assertConnected(screen.getByText("Outer panel"));
    assert.equal(screen.queryByText("Inner panel"), null);
    fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    assertConnected(screen.getByText("Inner panel"));
  });
  test("exposes data-slot attributes for styling", () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
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
  test("keeps multiple roots independent", () => {
    render(
      h(
        Fragment,
        null,
        h(
          Collapsible,
          { animation: false },
          h(CollapsibleTrigger, null, "One"),
          h(CollapsibleContent, null, "First"),
        ),
        h(
          Collapsible,
          { animation: false },
          h(CollapsibleTrigger, null, "Two"),
          h(CollapsibleContent, null, "Second"),
        ),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "One" }));
    assertConnected(screen.getByText("First"));
    assert.equal(screen.queryByText("Second"), null);
  });
  test("animates by default and keeps content mounted while closing", async () => {
    render(
      h(
        Collapsible,
        null,
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertConnected(screen.getByText("Panel"));
    });
    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    assertAttr(content, "data-animated");
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    assertConnected(screen.getByText("Panel"));
    assertAttr(content, "data-state", "closed");
    fireEvent.transitionEnd(content as HTMLElement, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      assert.equal(screen.queryByText("Panel"), null);
    });
  });
  test("animation={false} unmounts immediately on close", () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("injects grid rows that can collapse to a true zero height", async () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    await waitFor(() => {
      assert.notEqual(
        document.getElementById("zealakit-collapsible-styles"),
        null,
      );
    });
    const css =
      document.getElementById("zealakit-collapsible-styles")?.textContent ?? "";
    assert.ok(css.includes("minmax(0, 0fr)"));
    assert.ok(css.includes("minmax(0, 1fr)"));
    assert.ok(css.includes("overflow: hidden"));
  });
  test("applies consumer chrome to the clipped content wrapper", async () => {
    render(
      h(
        Collapsible,
        null,
        h(CollapsibleTrigger, null, "Toggle"),
        h(
          CollapsibleContent,
          {
            className: "panel-chrome",
            style: { borderLeft: "3px solid red", padding: "12px" },
          },
          "Panel",
        ),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertConnected(screen.getByText("Panel"));
    });
    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    const wrapper = viewport.querySelector(
      "[data-collapsible-content-wrapper]",
    ) as HTMLElement;
    assertAttr(viewport, "data-animated");
    assert.ok(!viewport.className.includes("panel-chrome"));
    assertClass(wrapper, "panel-chrome");
    assert.equal(wrapper.style.borderLeft, "3px solid red");
    assert.equal(wrapper.style.padding, "12px");
    // `open` is applied on the next animation frame.
    await waitFor(() => {
      assertAttr(wrapper, "data-state", "open");
    });
  });
  test("keeps content mounted through exit and ignores stale close after reopen", async () => {
    render(
      h(
        Collapsible,
        null,
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, { className: "panel-chrome" }, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    await waitFor(() => {
      assertConnected(screen.getByText("Panel"));
    });
    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    fireEvent.click(trigger);
    assertAttr(viewport, "data-state", "closed");
    assertConnected(screen.getByText("Panel"));
    assertAttr(
      viewport.querySelector("[data-collapsible-content-wrapper]"),
      "data-state",
      "closed",
    );
    fireEvent.click(trigger);
    await waitFor(() => {
      assertAttr(viewport, "data-state", "open");
    });
    fireEvent.transitionEnd(viewport, {
      propertyName: "grid-template-rows",
    });
    assertConnected(screen.getByText("Panel"));
    assertAttr(viewport, "data-state", "open");
  });
});
