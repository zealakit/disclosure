import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../src";

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
        <Accordion type="single" :animated="false">
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

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByText("General content")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.queryByText("General content")).toBeNull();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
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
        <Accordion type="single" collapsible :animated="false">
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
        </Accordion>
      `,
    });

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.queryByText("General content")).toBeNull();
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
        <Accordion type="multiple" :animated="false">
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

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    await fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByText("General content")).toBeInTheDocument();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
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
        <Accordion type="single" :animated="false">
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

    const general = screen.getByRole("button", { name: "General" });
    const advanced = screen.getByRole("button", { name: "Advanced" });
    general.focus();
    await fireEvent.keyDown(general, { key: "ArrowDown" });
    expect(advanced).toHaveFocus();
    await fireEvent.keyDown(advanced, { key: "Home" });
    expect(general).toHaveFocus();
  });
});
