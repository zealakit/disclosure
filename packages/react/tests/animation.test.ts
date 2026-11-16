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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DEFAULT_ANIMATION_DELAY,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_EASING,
} from "../dist/index.js";
import { assertAttr, assertNoAttr, assertConnected } from "./support/dom.ts";
afterEach(() => {
  cleanup();
  mock.restoreAll();
});
function getContent() {
  return screen
    .getByText("Panel")
    .closest('[data-slot="collapsible-content"]') as HTMLElement;
}
describe("@zealakit/disclosure-react animation config", () => {
  test("applies default animation CSS variables", async () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const content = getContent();
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-duration"),
      `${DEFAULT_ANIMATION_DURATION}ms`,
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-easing"),
      DEFAULT_ANIMATION_EASING,
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-delay"),
      `${DEFAULT_ANIMATION_DELAY}ms`,
    );
  });
  test("applies linear easing", async () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: { easing: "linear" } },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    assert.equal(
      getContent().style.getPropertyValue("--collapsible-animation-easing"),
      "linear",
    );
  });
  test("applies ease-in-out easing", async () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: { easing: "ease-in-out" } },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    assert.equal(
      getContent().style.getPropertyValue("--collapsible-animation-easing"),
      "ease-in-out",
    );
  });
  test("applies custom duration and delay including zero delay", async () => {
    render(
      h(
        Collapsible,
        {
          defaultOpen: true,
          animation: { duration: 320, delay: 0 },
        },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const content = getContent();
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-duration"),
      "320ms",
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-delay"),
      "0ms",
    );
  });
  test("applies non-zero delay", async () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: { delay: 120 } },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    assert.equal(
      getContent().style.getPropertyValue("--collapsible-animation-delay"),
      "120ms",
    );
  });
  test("updates animation variables when props change", async () => {
    function Harness() {
      const [duration, setDuration] = useState(200);
      return h(
        Fragment,
        null,
        h(
          "button",
          { type: "button", onClick: () => setDuration(450) },
          "Speed",
        ),
        h(
          Collapsible,
          { defaultOpen: true, animation: { duration: duration } },
          h(CollapsibleTrigger, null, "Toggle"),
          h(CollapsibleContent, null, "Panel"),
        ),
      );
    }
    render(h(Harness, null));
    assert.equal(
      getContent().style.getPropertyValue("--collapsible-animation-duration"),
      "200ms",
    );
    fireEvent.click(screen.getByRole("button", { name: "Speed" }));
    await waitFor(() => {
      assert.equal(
        getContent().style.getPropertyValue("--collapsible-animation-duration"),
        "450ms",
      );
    });
  });
  test("animation={false} ignores duration/delay and unmounts immediately", () => {
    render(
      h(
        Collapsible,
        {
          defaultOpen: true,
          animation: { enabled: false, duration: 800, delay: 400 },
        },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("reduced motion disables animated presence", async () => {
    mock.method(
      window,
      "matchMedia",
      (query: string) =>
        ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: mock.fn(),
          removeListener: mock.fn(),
          addEventListener: mock.fn(),
          removeEventListener: mock.fn(),
          dispatchEvent: mock.fn(),
        }) as unknown as MediaQueryList,
    );
    render(
      h(
        Collapsible,
        {
          defaultOpen: true,
          animation: { duration: 500, delay: 200 },
        },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const content = getContent();
    assertNoAttr(content, "data-animated");
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("keeps expand/collapse lifecycle with custom duration", async () => {
    render(
      h(
        Collapsible,
        { animation: { duration: 300, easing: "linear" } },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      assertConnected(screen.getByText("Panel"));
    });
    const content = getContent();
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    assertAttr(content, "data-state", "closed");
    assertConnected(screen.getByText("Panel"));
    fireEvent.transitionEnd(content, { propertyName: "grid-template-rows" });
    await waitFor(() => {
      assert.equal(screen.queryByText("Panel"), null);
    });
  });
  test("Accordion root animation config is inherited by item content", async () => {
    render(
      h(
        Accordion,
        {
          type: "single",
          collapsible: true,
          defaultValue: "general",
          animation: { easing: "linear", duration: 275, delay: 40 },
        },
        h(
          AccordionItem,
          { value: "general" },
          h(AccordionTrigger, null, "General"),
          h(AccordionContent, null, "General content"),
        ),
      ),
    );
    const content = screen
      .getByText("General content")
      .closest('[data-slot="accordion-content"]') as HTMLElement;
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-easing"),
      "linear",
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-duration"),
      "275ms",
    );
    assert.equal(
      content.style.getPropertyValue("--collapsible-animation-delay"),
      "40ms",
    );
  });
  test("rapid toggles remain stable with delay configured", async () => {
    render(
      h(
        Collapsible,
        { animation: { delay: 80, duration: 200 } },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    await waitFor(() => {
      assertConnected(screen.getByText("Panel"));
    });
    const content = getContent();
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    await waitFor(() => {
      assertAttr(content, "data-state", "open");
    });
    fireEvent.transitionEnd(content, { propertyName: "grid-template-rows" });
    assertConnected(screen.getByText("Panel"));
  });
});
