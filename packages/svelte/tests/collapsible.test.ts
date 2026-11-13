import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import AnimatedFixture from "./fixtures/animated.svelte";
import BasicFixture from "./fixtures/basic.svelte";
import ControlledFixture from "./fixtures/controlled.svelte";
import DisabledFixture from "./fixtures/disabled.svelte";
import ForceMountFixture from "./fixtures/force-mount.svelte";
import NestedFixture from "./fixtures/nested.svelte";
import MultipleFixture from "./fixtures/multiple.svelte";
import DefaultOpenFixture from "./fixtures/default-open.svelte";

afterEach(() => {
  cleanup();
});

describe("@zealakit/collapsible-svelte", () => {
  test("starts closed by default", () => {
    render(BasicFixture);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("starts open with defaultOpen", () => {
    render(DefaultOpenFixture);
    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });

  test("toggles uncontrolled state", async () => {
    render(BasicFixture);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Panel")).toBeInTheDocument();

    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("supports controlled open state", async () => {
    const onOpenChange = vi.fn();
    render(ControlledFixture, { props: { onOpenChange } });
    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("does not toggle when disabled", async () => {
    render(DisabledFixture);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toBeDisabled();
    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("forceMount keeps content in the DOM while hidden", async () => {
    render(ForceMountFixture);
    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("hidden");
    expect(content).toHaveAttribute("data-state", "closed");

    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(content).not.toHaveAttribute("hidden");
    expect(content).toHaveAttribute("data-state", "open");
  });

  test("sets aria relationship between trigger and content", () => {
    render(DefaultOpenFixture);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId ?? "")).toHaveTextContent("Panel");
  });

  test("supports nested independent instances", async () => {
    render(NestedFixture);
    await fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    expect(
      screen.getByText("Outer panel", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Inner panel")).toBeNull();

    await fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    expect(screen.getByText("Inner panel")).toBeInTheDocument();
  });

  test("exposes data-slot attributes for styling", () => {
    render(DefaultOpenFixture);
    expect(document.querySelector('[data-slot="collapsible"]')).not.toBeNull();
    expect(
      document.querySelector('[data-slot="collapsible-trigger"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="collapsible-content"]'),
    ).not.toBeNull();
  });

  test("keeps multiple roots independent", async () => {
    render(MultipleFixture);
    await fireEvent.click(screen.getByRole("button", { name: "One" }));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.queryByText("Second")).toBeNull();
  });

  test("animates by default and keeps content mounted while closing", async () => {
    render(AnimatedFixture);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    expect(content).toHaveAttribute("data-animated");
    expect(content).not.toHaveAttribute("hidden");
    expect(
      content.querySelector("[data-collapsible-content-wrapper]"),
    ).not.toBeNull();
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "open");
    });
    expect(content).not.toHaveAttribute("inert");

    await fireEvent.click(trigger);
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(content).toHaveAttribute("data-state", "closed");
    expect(content).toHaveAttribute("inert");

    await fireEvent.transitionEnd(content, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      expect(screen.queryByText("Panel")).toBeNull();
    });
  });

  test("animated={false} unmounts immediately on close", async () => {
    render(DefaultOpenFixture);
    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("injects animation styles once", async () => {
    render(AnimatedFixture);
    render(AnimatedFixture);
    expect(
      document.querySelectorAll("#zealakit-collapsible-styles"),
    ).toHaveLength(1);
  });
});
