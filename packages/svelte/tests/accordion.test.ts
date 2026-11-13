import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import AccordionAnimatedFixture from "./fixtures/accordion-animated.svelte";
import AccordionControlledFixture from "./fixtures/accordion-controlled.svelte";
import AccordionDisabledItemFixture from "./fixtures/accordion-disabled-item.svelte";
import AccordionMultipleFixture from "./fixtures/accordion-multiple.svelte";
import AccordionNestedFixture from "./fixtures/accordion-nested.svelte";
import AccordionSingleFixture from "./fixtures/accordion-single.svelte";

afterEach(() => {
  cleanup();
});

describe("@zealakit/collapsible-svelte Accordion", () => {
  test("single mode opens one item and keeps it open when collapsible is false", async () => {
    render(AccordionSingleFixture);

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByText("General content")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.getByText("General content")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.queryByText("General content")).toBeNull();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
  });

  test("single mode collapsible closes the open item", async () => {
    render(AccordionSingleFixture, { props: { collapsible: true } });

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(screen.queryByText("General content")).toBeNull();
  });

  test("multiple mode keeps several items open", async () => {
    render(AccordionMultipleFixture);

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    await fireEvent.click(screen.getByRole("button", { name: "Advanced" }));
    expect(screen.getByText("General content")).toBeInTheDocument();
    expect(screen.getByText("Advanced content")).toBeInTheDocument();
  });

  test("supports controlled single value", async () => {
    const onValueChange = vi.fn();
    render(AccordionControlledFixture, { props: { onValueChange } });

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(onValueChange).toHaveBeenCalledWith("general");
    expect(screen.getByText("General content")).toBeInTheDocument();

    await fireEvent.click(screen.getByRole("button", { name: "General" }));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(screen.queryByText("General content")).toBeNull();
  });

  test("disabled item does not open", async () => {
    render(AccordionDisabledItemFixture);

    const trigger = screen.getByRole("button", { name: "Locked" });
    await fireEvent.click(trigger);
    expect(trigger).toBeDisabled();
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  test("supports keyboard navigation with Home and End", async () => {
    render(AccordionSingleFixture);

    const general = screen.getByRole("button", { name: "General" });
    const advanced = screen.getByRole("button", { name: "Advanced" });
    general.focus();

    await fireEvent.keyDown(general, { key: "ArrowDown" });
    expect(advanced).toHaveFocus();

    await fireEvent.keyDown(advanced, { key: "ArrowDown" });
    expect(general).toHaveFocus();

    await fireEvent.keyDown(general, { key: "ArrowUp" });
    expect(advanced).toHaveFocus();

    await fireEvent.keyDown(advanced, { key: "Home" });
    expect(general).toHaveFocus();

    await fireEvent.keyDown(general, { key: "End" });
    expect(advanced).toHaveFocus();
  });

  test("exposes accordion accessibility relationships", () => {
    render(AccordionSingleFixture, { props: { defaultValue: "general" } });

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

  test("supports nested accordions", async () => {
    render(AccordionNestedFixture);

    await fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    expect(screen.getByText("Outer content")).toBeInTheDocument();
    expect(screen.queryByText("Inner content")).toBeNull();

    await fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    expect(screen.getByText("Inner content")).toBeInTheDocument();
  });

  test("animates by default and unmounts after transitionend", async () => {
    render(AccordionAnimatedFixture);
    const trigger = screen.getByRole("button", { name: "General" });

    await fireEvent.click(trigger);
    const content = (await screen.findByText("General content")).closest(
      '[data-slot="accordion-content"]',
    ) as HTMLElement;
    expect(content).toHaveAttribute("data-animated");
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "open");
    });

    await fireEvent.click(trigger);
    expect(screen.getByText("General content")).toBeInTheDocument();
    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("inert");

    await fireEvent.transitionEnd(content, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      expect(screen.queryByText("General content")).toBeNull();
    });
  });
});
