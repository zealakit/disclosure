import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../src";

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
  return (
    <Accordion
      type="single"
      collapsible={collapsible}
      defaultValue={defaultValue}
      animated={false}
    >
      <AccordionItem value="general">
        <AccordionTrigger>General</AccordionTrigger>
        <AccordionContent>General content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="advanced">
        <AccordionTrigger>Advanced</AccordionTrigger>
        <AccordionContent>Advanced content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("@zealakit/collapsible-react Accordion", () => {
  test("single mode opens one item and keeps it open when collapsible is false", () => {
    render(<SingleFixture />);

    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByText("General content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByText("General content")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.queryByText("General content")).toBeNull();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
  });

  test("single mode collapsible closes the open item", () => {
    render(<SingleFixture collapsible />);

    fireEvent.click(screen.getByRole("button", { name: "General" }));
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.queryByText("General content")).toBeNull();
  });

  test("multiple mode keeps several items open", () => {
    render(
      <Accordion type="multiple" animated={false}>
        <AccordionItem value="general">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>General content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="advanced">
          <AccordionTrigger>Advanced</AccordionTrigger>
          <AccordionContent>Advanced content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole("button", { name: "General" }));
    fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByText("General content")).toBeInTheDocument();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
  });

  test("supports controlled single value", () => {
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Accordion
          type="single"
          collapsible
          animated={false}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        >
          <AccordionItem value="general">
            <AccordionTrigger>General</AccordionTrigger>
            <AccordionContent>General content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(onValueChange).toHaveBeenCalledWith("general");
    expect(screen.getByText("General content")).toBeInTheDocument();
  });

  test("disabled item does not open", () => {
    render(
      <Accordion type="single" collapsible animated={false}>
        <AccordionItem value="locked" disabled>
          <AccordionTrigger>Locked</AccordionTrigger>
          <AccordionContent>Hidden</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "Locked" });
    fireEvent.click(trigger);
    expect(trigger).toBeDisabled();
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  test("supports keyboard navigation with Home and End", () => {
    render(<SingleFixture />);

    const general = screen.getByRole("button", { name: "General" });
    const advanced = screen.getByRole("button", { name: "Advanced" });
    general.focus();

    fireEvent.keyDown(general, { key: "ArrowDown" });
    expect(advanced).toHaveFocus();

    fireEvent.keyDown(advanced, { key: "Home" });
    expect(general).toHaveFocus();

    fireEvent.keyDown(general, { key: "End" });
    expect(advanced).toHaveFocus();
  });

  test("exposes accordion accessibility relationships", () => {
    render(<SingleFixture defaultValue="general" />);

    const trigger = screen.getByRole("button", { name: "General" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    expect(panel?.tagName).toBe("SECTION");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(trigger.closest('[data-slot="accordion-heading"]')?.tagName).toBe(
      "H3",
    );
  });

  test("supports nested accordions", () => {
    render(
      <Accordion type="single" collapsible animated={false}>
        <AccordionItem value="outer">
          <AccordionTrigger>Outer</AccordionTrigger>
          <AccordionContent>
            Outer content
            <Accordion type="single" collapsible animated={false}>
              <AccordionItem value="inner">
                <AccordionTrigger>Inner</AccordionTrigger>
                <AccordionContent>Inner content</AccordionContent>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    expect(screen.getByText("Outer content")).toBeInTheDocument();
    expect(screen.queryByText("Inner content")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    expect(screen.getByText("Inner content")).toBeInTheDocument();
  });
});
