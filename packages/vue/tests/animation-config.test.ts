import { cleanup, fireEvent, render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  type AnimationConfig,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../src";

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

function snapshot(selector: string) {
  const content = screen.getByText("Panel").closest(selector) as HTMLElement;
  return {
    animated: content.hasAttribute("data-animated"),
    duration: content.style.getPropertyValue(
      "--collapsible-animation-duration",
    ),
    easing: content.style.getPropertyValue("--collapsible-animation-easing"),
    delay: content.style.getPropertyValue("--collapsible-animation-delay"),
  };
}

function renderCollapsible(attrs: string, setup: object = {}) {
  const view = render({
    components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
    setup: () => setup,
    template: `
      <Collapsible default-open ${attrs}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>`,
  });
  const result = snapshot('[data-slot="collapsible-content"]');
  view.unmount();
  return result;
}

describe("@zealakit/disclosure-vue animation option", () => {
  const cases: Array<[string, string, string]> = [
    ["default", "", ""],
    ["animated=false", ':animated="false"', ':animation="false"'],
    ["duration", ':animation-duration="320"', ':animation="{ duration: 320 }"'],
    ["delay", ':animation-delay="120"', ':animation="{ delay: 120 }"'],
    [
      "easing",
      'animation-timing-function="linear"',
      ":animation=\"{ easing: 'linear' }\"",
    ],
    [
      "all",
      ':animated="false" :animation-duration="10" :animation-delay="20" animation-timing-function="linear"',
      ":animation=\"{ enabled: false, duration: 10, delay: 20, easing: 'linear' }\"",
    ],
  ];

  for (const [name, legacy, next] of cases) {
    test(`${name}: animation matches legacy props`, () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      expect(renderCollapsible(next)).toEqual(renderCollapsible(legacy));
    });
  }

  test("animation wins over legacy props", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = renderCollapsible(
      ':animation="{ duration: 50 }" :animation-duration="999" :animated="false"',
    );
    expect(result.duration).toBe("50ms");
    expect(result.animated).toBe(true);
  });

  test("animation={false} unmounts immediately on close", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible default-open :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>`,
    });
    await fireEvent.click(screen.getByText("Toggle"));
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("Accordion reads animation config", () => {
    render({
      components: {
        Accordion,
        AccordionItem,
        AccordionTrigger,
        AccordionContent,
      },
      template: `
        <Accordion default-value="a" :animation="{ duration: 320, easing: 'linear' }">
          <AccordionItem value="a">
            <AccordionTrigger>T</AccordionTrigger>
            <AccordionContent>Panel</AccordionContent>
          </AccordionItem>
        </Accordion>`,
    });
    expect(snapshot('[data-slot="accordion-content"]')).toMatchObject({
      duration: "320ms",
      easing: "linear",
    });
  });
});
