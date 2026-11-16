import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  type AnimationConfig,
  createDisclosure,
  normalizeAnimationConfig,
} from "../dist/index.js";
import { assertMatchObject } from "./support/dom.ts";

afterEach(() => {
  document.body.innerHTML = "";
  document.getElementById("zealakit-collapsible-styles")?.remove();
});

// Exhaustive key check: fails to compile if AnimationConfig drifts from the shared contract.
const _keys = {
  enabled: true,
  duration: true,
  delay: true,
  easing: true,
} satisfies Record<keyof AnimationConfig, true>;
void _keys;

function snapshot(rootAttrs: string, kind: "collapsible" | "accordion") {
  document.body.innerHTML =
    kind === "collapsible"
      ? `<div data-disclosure data-default-open ${rootAttrs}>
          <button data-disclosure-trigger>T</button>
          <div data-disclosure-content>Panel</div>
        </div>`
      : `<div data-accordion data-accordion-type="single" data-default-value="a" ${rootAttrs}>
          <section data-accordion-item data-value="a">
            <h3><button type="button" data-accordion-trigger>T</button></h3>
            <div data-accordion-content>Panel</div>
          </section>
        </div>`;
  const controller = createDisclosure(document.body);
  const content = document.querySelector(
    "[data-disclosure-content], [data-accordion-content]",
  ) as HTMLElement;
  const result = {
    animated: content.hasAttribute("data-animated"),
    duration: content.style.getPropertyValue(
      "--collapsible-animation-duration",
    ),
    easing: content.style.getPropertyValue("--collapsible-animation-easing"),
    delay: content.style.getPropertyValue("--collapsible-animation-delay"),
  };
  controller.destroy();
  return result;
}

describe("@zealakit/disclosure-vanilla animation attributes", () => {
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
    ["disabled", 'data-animation="false"', { animated: false }],
    ["duration", 'data-animation-duration="320"', { duration: "320ms" }],
    ["easing", 'data-animation-easing="linear"', { easing: "linear" }],
    [
      "all",
      'data-animation="false" data-animation-duration="10" data-animation-delay="20" data-animation-easing="linear"',
      { animated: false, duration: "10ms", delay: "20ms", easing: "linear" },
    ],
  ];

  for (const kind of ["collapsible", "accordion"] as const) {
    for (const [name, attrs, expected] of cases) {
      test(`${kind} ${name}`, () => {
        assertMatchObject(snapshot(attrs, kind), expected);
      });
    }
  }

  test('data-animation="" and "true" enable with overrides', () => {
    assertMatchObject(
      snapshot('data-animation="" data-animation-duration="70"', "collapsible"),
      {
        animated: true,
        duration: "70ms",
      },
    );
    assert.equal(
      snapshot('data-animation="true"', "collapsible").animated,
      true,
    );
  });

  test("data-animation-easing passes any non-empty value", () => {
    assert.equal(
      snapshot(
        'data-animation-easing="cubic-bezier(0.4, 0, 0.2, 1)"',
        "collapsible",
      ).easing,
      "cubic-bezier(0.4, 0, 0.2, 1)",
    );
  });

  test("normalizeAnimationConfig defaults", () => {
    assert.deepEqual(normalizeAnimationConfig(undefined), {
      enabled: true,
      duration: 200,
      delay: 0,
      easing: "ease-in-out",
    });
  });
});
