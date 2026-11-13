import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DEFAULT_ANIMATION_DELAY_MS,
  DEFAULT_ANIMATION_DURATION_MS,
  DEFAULT_ANIMATION_TIMING_FUNCTION,
} from "../src";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function getContent() {
  return screen
    .getByText("Panel")
    .closest('[data-slot="collapsible-content"]') as HTMLElement;
}

describe("@zealakit/disclosure-react animation config", () => {
  test("applies default animation CSS variables", async () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const content = getContent();
    expect(
      content.style.getPropertyValue("--collapsible-animation-duration"),
    ).toBe(`${DEFAULT_ANIMATION_DURATION_MS}ms`);
    expect(
      content.style.getPropertyValue("--collapsible-animation-easing"),
    ).toBe(DEFAULT_ANIMATION_TIMING_FUNCTION);
    expect(
      content.style.getPropertyValue("--collapsible-animation-delay"),
    ).toBe(`${DEFAULT_ANIMATION_DELAY_MS}ms`);
  });

  test("applies linear easing", async () => {
    render(
      <Collapsible defaultOpen animationTimingFunction="linear">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    expect(
      getContent().style.getPropertyValue("--collapsible-animation-easing"),
    ).toBe("linear");
  });

  test("applies ease-in-out easing", async () => {
    render(
      <Collapsible defaultOpen animationTimingFunction="ease-in-out">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    expect(
      getContent().style.getPropertyValue("--collapsible-animation-easing"),
    ).toBe("ease-in-out");
  });

  test("applies custom duration and delay including zero delay", async () => {
    render(
      <Collapsible defaultOpen animationDuration={320} animationDelay={0}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const content = getContent();
    expect(
      content.style.getPropertyValue("--collapsible-animation-duration"),
    ).toBe("320ms");
    expect(
      content.style.getPropertyValue("--collapsible-animation-delay"),
    ).toBe("0ms");
  });

  test("applies non-zero delay", async () => {
    render(
      <Collapsible defaultOpen animationDelay={120}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    expect(
      getContent().style.getPropertyValue("--collapsible-animation-delay"),
    ).toBe("120ms");
  });

  test("updates animation variables when props change", async () => {
    function Harness() {
      const [duration, setDuration] = useState(200);
      return (
        <>
          <button type="button" onClick={() => setDuration(450)}>
            Speed
          </button>
          <Collapsible defaultOpen animationDuration={duration}>
            <CollapsibleTrigger>Toggle</CollapsibleTrigger>
            <CollapsibleContent>Panel</CollapsibleContent>
          </Collapsible>
        </>
      );
    }

    render(<Harness />);
    expect(
      getContent().style.getPropertyValue("--collapsible-animation-duration"),
    ).toBe("200ms");

    fireEvent.click(screen.getByRole("button", { name: "Speed" }));
    await waitFor(() => {
      expect(
        getContent().style.getPropertyValue("--collapsible-animation-duration"),
      ).toBe("450ms");
    });
  });

  test("animated={false} ignores duration/delay and unmounts immediately", () => {
    render(
      <Collapsible
        defaultOpen
        animated={false}
        animationDuration={800}
        animationDelay={400}
      >
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("reduced motion disables animated presence", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <Collapsible defaultOpen animationDuration={500} animationDelay={200}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const content = getContent();
    expect(content).not.toHaveAttribute("data-animated");

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("keeps expand/collapse lifecycle with custom duration", async () => {
    render(
      <Collapsible animationDuration={300} animationTimingFunction="linear">
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const content = getContent();
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(content).toHaveAttribute("data-state", "closed");
    expect(screen.getByText("Panel")).toBeInTheDocument();

    fireEvent.transitionEnd(content, { propertyName: "grid-template-rows" });
    await waitFor(() => {
      expect(screen.queryByText("Panel")).toBeNull();
    });
  });

  test("Accordion root animation config is inherited by item content", async () => {
    render(
      <Accordion
        type="single"
        collapsible
        defaultValue="general"
        animationTimingFunction="linear"
        animationDuration={275}
        animationDelay={40}
      >
        <AccordionItem value="general">
          <AccordionTrigger>General</AccordionTrigger>
          <AccordionContent>General content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const content = screen
      .getByText("General content")
      .closest('[data-slot="accordion-content"]') as HTMLElement;

    expect(
      content.style.getPropertyValue("--collapsible-animation-easing"),
    ).toBe("linear");
    expect(
      content.style.getPropertyValue("--collapsible-animation-duration"),
    ).toBe("275ms");
    expect(
      content.style.getPropertyValue("--collapsible-animation-delay"),
    ).toBe("40ms");
  });

  test("rapid toggles remain stable with delay configured", async () => {
    render(
      <Collapsible animationDelay={80} animationDuration={200}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const content = getContent();
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "open");
    });

    fireEvent.transitionEnd(content, { propertyName: "grid-template-rows" });
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });
});
