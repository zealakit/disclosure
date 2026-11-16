import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AnimationConfig,
  type AnimationSetting,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DEFAULT_ANIMATION_DELAY,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANIMATION_EASING,
} from "../src";
import { normalizeAnimationConfig } from "../src/animation";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Exhaustive key check: fails to compile if AnimationConfig drifts from the shared contract.
const _keys = {
  enabled: true,
  duration: true,
  delay: true,
  easing: true,
} satisfies Record<keyof AnimationConfig, true>;
void _keys;

function snapshot(content: HTMLElement) {
  return {
    animated: content.hasAttribute("data-animated"),
    duration: content.style.getPropertyValue(
      "--collapsible-animation-duration",
    ),
    easing: content.style.getPropertyValue("--collapsible-animation-easing"),
    delay: content.style.getPropertyValue("--collapsible-animation-delay"),
  };
}

function renderCollapsible(props: Record<string, unknown>) {
  const view = render(
    <Collapsible defaultOpen {...props}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Panel</CollapsibleContent>
    </Collapsible>,
  );
  const content = screen
    .getByText("Panel")
    .closest('[data-slot="collapsible-content"]') as HTMLElement;
  const result = snapshot(content);
  view.unmount();
  return result;
}

describe("normalizeAnimationConfig", () => {
  test("defaults", () => {
    const expected = {
      enabled: true,
      duration: DEFAULT_ANIMATION_DURATION,
      delay: DEFAULT_ANIMATION_DELAY,
      easing: DEFAULT_ANIMATION_EASING,
    };
    expect(normalizeAnimationConfig(undefined)).toEqual(expected);
    expect(normalizeAnimationConfig(true)).toEqual(expected);
    expect(normalizeAnimationConfig({})).toEqual(expected);
  });

  test("false and enabled:false disable and keep defaults", () => {
    expect(normalizeAnimationConfig(false).enabled).toBe(false);
    expect(normalizeAnimationConfig({ enabled: false, duration: 5 })).toEqual({
      enabled: false,
      duration: 5,
      delay: 0,
      easing: "ease-in-out",
    });
  });
});

describe("animation option equivalence with legacy props", () => {
  const cases: Array<[string, Record<string, unknown>, AnimationSetting]> = [
    ["default", {}, true],
    ["animated=false", { animated: false }, false],
    ["duration", { animationDuration: 320 }, { duration: 320 }],
    ["delay", { animationDelay: 120 }, { delay: 120 }],
    ["easing", { animationTimingFunction: "linear" }, { easing: "linear" }],
    [
      "all",
      {
        animated: false,
        animationDuration: 10,
        animationDelay: 20,
        animationTimingFunction: "linear",
      },
      { enabled: false, duration: 10, delay: 20, easing: "linear" },
    ],
  ];

  for (const [name, legacy, next] of cases) {
    test(name, () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(renderCollapsible({ animation: next })).toEqual(
        renderCollapsible(legacy),
      );
    });
  }

  test("animation wins over legacy props", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = renderCollapsible({
      animation: { duration: 50 },
      animationDuration: 999,
      animated: false,
    });
    expect(result.duration).toBe("50ms");
    expect(result.animated).toBe(true);
  });

  test("accepts custom CSS easing", () => {
    expect(
      renderCollapsible({
        animation: { easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      }).easing,
    ).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
  });

  test("animation={false} unmounts immediately on close", () => {
    render(
      <Collapsible defaultOpen animation={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>,
    );
    fireEvent.click(screen.getByText("Toggle"));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("Accordion reads animation config", () => {
    render(
      <Accordion
        defaultValue="a"
        animation={{ duration: 320, easing: "linear" }}
      >
        <AccordionItem value="a">
          <AccordionTrigger>T</AccordionTrigger>
          <AccordionContent>Panel</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    const content = screen
      .getByText("Panel")
      .closest('[data-slot="accordion-content"]') as HTMLElement;
    expect(snapshot(content)).toMatchObject({
      duration: "320ms",
      easing: "linear",
    });
  });
});
