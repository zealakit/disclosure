import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState, createElement as h } from "react";
import assert from "node:assert/strict";
import { afterEach, describe, mock, test } from "node:test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../dist/index.js";
import {
  assertAttr,
  assertFocused,
  assertDisabled,
  assertConnected,
  assertCalledWith,
} from "./support/dom.ts";
afterEach(() => {
  cleanup();
});
function SingleFixture({
  collapsible = false,
  defaultValue,
}: {
  collapsible?: boolean;
  defaultValue?: string | null;
}) {
  return h(
    Accordion,
    {
      type: "single",
      collapsible: collapsible,
      defaultValue: defaultValue,
      animation: false,
    },
    h(
      AccordionItem,
      { value: "general" },
      h(AccordionTrigger, null, "General"),
      h(AccordionContent, null, "General content"),
    ),
    h(
      AccordionItem,
      { value: "advanced" },
      h(AccordionTrigger, null, "Advanced"),
      h(AccordionContent, null, "Advanced content"),
    ),
  );
}
describe("@zealakit/disclosure-react Accordion", () => {
  test("single mode opens one item and keeps it open when collapsible is false", () => {
    render(h(SingleFixture, null));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    assertConnected(screen.getByText("General content"));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    assertConnected(screen.getByText("General content"));
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    assert.equal(screen.queryByText("General content"), null);
    assertConnected(screen.getByText("Advanced content"));
  });
  test("single mode collapsible closes the open item", () => {
    render(h(SingleFixture, { collapsible: true }));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    assert.equal(screen.queryByText("General content"), null);
  });
  test("multiple mode keeps several items open", () => {
    render(
      h(
        Accordion,
        { type: "multiple", animation: false },
        h(
          AccordionItem,
          { value: "general" },
          h(AccordionTrigger, null, "General"),
          h(AccordionContent, null, "General content"),
        ),
        h(
          AccordionItem,
          { value: "advanced" },
          h(AccordionTrigger, null, "Advanced"),
          h(AccordionContent, null, "Advanced content"),
        ),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    assertConnected(screen.getByText("General content"));
    assertConnected(screen.getByText("Advanced content"));
  });
  test("supports controlled single value", () => {
    const onValueChange = mock.fn();
    function Controlled() {
      const [value, setValue] = useState<string | null>(null);
      return h(
        Accordion,
        {
          type: "single",
          collapsible: true,
          animation: false,
          value: value,
          onValueChange: (next: string | null) => {
            onValueChange(next);
            setValue(next);
          },
        },
        h(
          AccordionItem,
          { value: "general" },
          h(AccordionTrigger, null, "General"),
          h(AccordionContent, null, "General content"),
        ),
      );
    }
    render(h(Controlled, null));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    assertCalledWith(onValueChange, "general");
    assertConnected(screen.getByText("General content"));
  });
  test("disabled item does not open", () => {
    render(
      h(
        Accordion,
        {
          type: "single",
          collapsible: true,
          animation: false,
        },
        h(
          AccordionItem,
          { value: "locked", disabled: true },
          h(AccordionTrigger, null, "Locked"),
          h(AccordionContent, null, "Hidden"),
        ),
      ),
    );
    const trigger = screen.getByRole("button", { name: "Locked" });
    fireEvent.click(trigger);
    assertDisabled(trigger);
    assert.equal(screen.queryByText("Hidden"), null);
  });
  test("supports keyboard navigation with Home and End", () => {
    render(h(SingleFixture, null));
    const general = screen.getByRole("button", { name: "General" });
    const advanced = screen.getByRole("button", { name: "Advanced" });
    general.focus();
    fireEvent.keyDown(general, { key: "ArrowDown" });
    assertFocused(advanced);
    fireEvent.keyDown(advanced, { key: "Home" });
    assertFocused(general);
    fireEvent.keyDown(general, { key: "End" });
    assertFocused(advanced);
  });
  test("exposes accordion accessibility relationships", () => {
    render(h(SingleFixture, { defaultValue: "general" }));
    const trigger = screen.getByRole("button", { name: "General" });
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
  test("supports nested accordions", () => {
    render(
      h(
        Accordion,
        {
          type: "single",
          collapsible: true,
          animation: false,
        },
        h(
          AccordionItem,
          { value: "outer" },
          h(AccordionTrigger, null, "Outer"),
          h(
            AccordionContent,
            null,
            "Outer content",
            h(
              Accordion,
              {
                type: "single",
                collapsible: true,
                animation: false,
              },
              h(
                AccordionItem,
                { value: "inner" },
                h(AccordionTrigger, null, "Inner"),
                h(AccordionContent, null, "Inner content"),
              ),
            ),
          ),
        ),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    assertConnected(screen.getByText("Outer content"));
    assert.equal(screen.queryByText("Inner content"), null);
    fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    assertConnected(screen.getByText("Inner content"));
  });
});
