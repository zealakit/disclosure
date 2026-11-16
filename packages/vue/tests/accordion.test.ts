import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../dist/index.js";
import {
  render,
  cleanup,
  getByRole,
  getByText,
  queryByText,
  click,
  keydown,
  assertFocused,
  assertConnected,
} from "./support/dom.ts";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-vue Accordion", () => {
  test("single mode opens one item at a time", async () => {
    render({
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template: `
        <Accordion type="single" :animation="false">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionContent>Advanced content</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    });

    await click(getByRole("button", { name: "General" }));
    assertConnected(getByText("General content"));

    await click(getByRole("button", { name: "Advanced" }));
    assert.equal(queryByText("General content"), null);
    assertConnected(getByText("Advanced content"));
  });

  test("single collapsible closes open item", async () => {
    render({
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template: `
        <Accordion type="single" collapsible :animation="false">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    });

    await click(getByRole("button", { name: "General" }));
    await click(getByRole("button", { name: "General" }));
    assert.equal(queryByText("General content"), null);
  });

  test("multiple mode keeps several items open", async () => {
    render({
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template: `
        <Accordion type="multiple" :animation="false">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionContent>Advanced content</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    });

    await click(getByRole("button", { name: "General" }));
    await click(getByRole("button", { name: "Advanced" }));
    assertConnected(getByText("General content"));
    assertConnected(getByText("Advanced content"));
  });

  test("supports keyboard navigation", async () => {
    render({
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template: `
        <Accordion type="single" :animation="false">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
          <AccordionItem value="advanced">
            <AccordionTrigger>Advanced</AccordionTrigger>
            <AccordionContent>Advanced content</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    });

    const general = getByRole("button", { name: "General" });
    const advanced = getByRole("button", { name: "Advanced" });
    general.focus();
    await keydown(general, "ArrowDown");
    assertFocused(advanced);
    await keydown(advanced, "Home");
    assertFocused(general);
  });
});
