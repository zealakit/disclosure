import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  type AnimationConfig,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../dist/index.js";
import {
  render,
  cleanup,
  getByText,
  queryByText,
  click,
  assertMatchObject,
} from "./support/dom.ts";

afterEach(() => {
  cleanup();
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
  const content = getByText("Panel").closest(selector) as HTMLElement;
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
  const cases: Array<[string, string, Record<string, unknown>]> = [
    [
      "default",
      "",
      {
        animated: true,
        duration: "200ms",
        easing: "ease-in-out",
        delay: "0ms",
      },
    ],
    ["false", ':animation="false"', { animated: false, duration: "200ms" }],
    ["duration", ':animation="{ duration: 320 }"', { duration: "320ms" }],
    ["delay", ':animation="{ delay: 120 }"', { delay: "120ms" }],
    ["easing", ":animation=\"{ easing: 'linear' }\"", { easing: "linear" }],
    [
      "all",
      ":animation=\"{ enabled: false, duration: 10, delay: 20, easing: 'linear' }\"",
      { animated: false, duration: "10ms", delay: "20ms", easing: "linear" },
    ],
  ];

  for (const [name, attrs, expected] of cases) {
    test(name, () => {
      assertMatchObject(renderCollapsible(attrs), expected);
    });
  }

  test("animation={false} unmounts immediately on close", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible default-open :animation="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>`,
    });
    await click(getByText("Toggle"));
    assert.equal(queryByText("Panel"), null);
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
    assertMatchObject(snapshot('[data-slot="accordion-content"]'), {
      duration: "320ms",
      easing: "linear",
    });
  });
});
