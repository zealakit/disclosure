import { createElement as h } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
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
} from "../dist/index.js";
import { assertMatchObject } from "./support/dom.ts";
import { normalizeAnimationConfig } from "../dist/animation.js";
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
    h(
      Collapsible,
      { defaultOpen: true, ...props },
      h(CollapsibleTrigger, null, "Toggle"),
      h(CollapsibleContent, null, "Panel"),
    ),
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
    assert.deepEqual(normalizeAnimationConfig(undefined), expected);
    assert.deepEqual(normalizeAnimationConfig(true), expected);
    assert.deepEqual(normalizeAnimationConfig({}), expected);
  });
  test("false and enabled:false disable and keep defaults", () => {
    assert.equal(normalizeAnimationConfig(false).enabled, false);
    assert.deepEqual(
      normalizeAnimationConfig({ enabled: false, duration: 5 }),
      {
        enabled: false,
        duration: 5,
        delay: 0,
        easing: "ease-in-out",
      },
    );
  });
});
describe("animation option", () => {
  const cases: Array<[string, AnimationSetting, Record<string, unknown>]> = [
    [
      "default",
      true,
      {
        animated: true,
        duration: "200ms",
        easing: "ease-in-out",
        delay: "0ms",
      },
    ],
    [
      "false",
      false,
      {
        animated: false,
        duration: "200ms",
        easing: "ease-in-out",
        delay: "0ms",
      },
    ],
    ["duration", { duration: 320 }, { duration: "320ms" }],
    ["delay", { delay: 120 }, { delay: "120ms" }],
    ["easing", { easing: "linear" }, { easing: "linear" }],
    [
      "all",
      { enabled: false, duration: 10, delay: 20, easing: "linear" },
      { animated: false, duration: "10ms", delay: "20ms", easing: "linear" },
    ],
  ];
  for (const [name, animation, expected] of cases) {
    test(name, () => {
      assertMatchObject(renderCollapsible({ animation }), expected);
    });
  }
  test("accepts custom CSS easing", () => {
    assert.equal(
      renderCollapsible({
        animation: { easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
      }).easing,
      "cubic-bezier(0.4, 0, 0.2, 1)",
    );
  });
  test("animation={false} unmounts immediately on close", () => {
    render(
      h(
        Collapsible,
        { defaultOpen: true, animation: false },
        h(CollapsibleTrigger, null, "Toggle"),
        h(CollapsibleContent, null, "Panel"),
      ),
    );
    fireEvent.click(screen.getByText("Toggle"));
    assert.equal(screen.queryByText("Panel"), null);
  });
  test("Accordion reads animation config", () => {
    render(
      h(
        Accordion,
        { defaultValue: "a", animation: { duration: 320, easing: "linear" } },
        h(
          AccordionItem,
          { value: "a" },
          h(AccordionTrigger, null, "T"),
          h(AccordionContent, null, "Panel"),
        ),
      ),
    );
    const content = screen
      .getByText("Panel")
      .closest('[data-slot="accordion-content"]') as HTMLElement;
    assertMatchObject(snapshot(content), {
      duration: "320ms",
      easing: "linear",
    });
  });
});
