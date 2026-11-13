import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../src";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-react", () => {
  test("starts closed by default", () => {
    render(
      <Collapsible animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("starts open with defaultOpen", () => {
    render(
      <Collapsible defaultOpen animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });

  test("toggles uncontrolled state", () => {
    render(
      <Collapsible animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Panel")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("supports controlled open state", () => {
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Collapsible
          animated={false}
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      );
    }

    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("does not toggle when disabled", () => {
    render(
      <Collapsible disabled animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("forceMount keeps content in the DOM while hidden", async () => {
    render(
      <Collapsible animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent forceMount>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("hidden");
    expect(content).toHaveAttribute("data-state", "closed");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(content).not.toHaveAttribute("hidden");
      expect(content).toHaveAttribute("data-state", "open");
    });
  });

  test("sets aria relationship between trigger and content", () => {
    render(
      <Collapsible defaultOpen animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    const contentId = trigger.getAttribute("aria-controls");
    expect(contentId).toBeTruthy();
    expect(document.getElementById(contentId ?? "")).toHaveTextContent("Panel");
  });

  test("supports nested independent instances", () => {
    render(
      <Collapsible animated={false}>
        <CollapsibleTrigger>Outer</CollapsibleTrigger>
        <CollapsibleContent>
          Outer panel
          <Collapsible animated={false}>
            <CollapsibleTrigger>Inner</CollapsibleTrigger>
            <CollapsibleContent>Inner panel</CollapsibleContent>
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Outer" }));
    expect(screen.getByText("Outer panel")).toBeInTheDocument();
    expect(screen.queryByText("Inner panel")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Inner" }));
    expect(screen.getByText("Inner panel")).toBeInTheDocument();
  });

  test("exposes data-slot attributes for styling", () => {
    render(
      <Collapsible defaultOpen animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    expect(document.querySelector('[data-slot="collapsible"]')).not.toBeNull();
    expect(
      document.querySelector('[data-slot="collapsible-trigger"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('[data-slot="collapsible-content"]'),
    ).not.toBeNull();
  });

  test("keeps multiple roots independent", () => {
    render(
      <>
        <Collapsible animated={false}>
          <CollapsibleTrigger>One</CollapsibleTrigger>
          <CollapsibleContent>First</CollapsibleContent>
        </Collapsible>
        <Collapsible animated={false}>
          <CollapsibleTrigger>Two</CollapsibleTrigger>
          <CollapsibleContent>Second</CollapsibleContent>
        </Collapsible>
      </>,
    );

    fireEvent.click(screen.getByRole("button", { name: "One" }));
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.queryByText("Second")).toBeNull();
  });

  test("animates by default and keeps content mounted while closing", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    expect(content).toHaveAttribute("data-animated");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(content).toHaveAttribute("data-state", "closed");

    fireEvent.transitionEnd(content as HTMLElement, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      expect(screen.queryByText("Panel")).toBeNull();
    });
  });

  test("animated={false} unmounts immediately on close", () => {
    render(
      <Collapsible defaultOpen animated={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("injects grid rows that can collapse to a true zero height", async () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    await waitFor(() => {
      expect(
        document.getElementById("zealakit-collapsible-styles"),
      ).not.toBeNull();
    });

    const css =
      document.getElementById("zealakit-collapsible-styles")?.textContent ?? "";
    expect(css).toContain("minmax(0, 0fr)");
    expect(css).toContain("minmax(0, 1fr)");
    expect(css).toContain("overflow: hidden");
  });

  test("applies consumer chrome to the clipped content wrapper", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent
          className="panel-chrome"
          style={{ borderLeft: "3px solid red", padding: "12px" }}
        >
          Panel
        </CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    const wrapper = viewport.querySelector(
      "[data-collapsible-content-wrapper]",
    ) as HTMLElement;

    expect(viewport).toHaveAttribute("data-animated");
    expect(viewport.className).not.toContain("panel-chrome");
    expect(wrapper).toHaveClass("panel-chrome");
    expect(wrapper.style.borderLeft).toBe("3px solid red");
    expect(wrapper.style.padding).toBe("12px");
    expect(wrapper).toHaveAttribute("data-state", "open");
  });

  test("keeps content mounted through exit and ignores stale close after reopen", async () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent className="panel-chrome">Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;

    fireEvent.click(trigger);
    expect(viewport).toHaveAttribute("data-state", "closed");
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(
      viewport.querySelector("[data-collapsible-content-wrapper]"),
    ).toHaveAttribute("data-state", "closed");

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(viewport).toHaveAttribute("data-state", "open");
    });

    fireEvent.transitionEnd(viewport, {
      propertyName: "grid-template-rows",
    });
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(viewport).toHaveAttribute("data-state", "open");
  });
});
