import { afterEach, describe, expect, test, vi } from "vitest";
import {
  type AnimationConfig,
  createDisclosure,
  normalizeAnimationConfig,
} from "../src";

afterEach(() => {
  document.body.innerHTML = "";
  document.getElementById("zealakit-collapsible-styles")?.remove();
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
  const cases: Array<[string, string, string]> = [
    ["default", "", ""],
    ["disabled", 'data-animated="false"', 'data-animation="false"'],
    [
      "duration",
      'data-animation-duration="320"',
      'data-animation-duration="320"',
    ],
    [
      "easing",
      'data-animation-timing-function="linear"',
      'data-animation-easing="linear"',
    ],
    [
      "all",
      'data-animated="false" data-animation-duration="10" data-animation-delay="20" data-animation-timing-function="linear"',
      'data-animation="false" data-animation-duration="10" data-animation-delay="20" data-animation-easing="linear"',
    ],
  ];

  for (const kind of ["collapsible", "accordion"] as const) {
    for (const [name, legacy, next] of cases) {
      test(`${kind} ${name}: data-animation* matches legacy attrs`, () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(snapshot(next, kind)).toEqual(snapshot(legacy, kind));
      });
    }
  }

  test('data-animation="" and "true" enable with overrides', () => {
    expect(
      snapshot('data-animation="" data-animation-duration="70"', "collapsible"),
    ).toMatchObject({
      animated: true,
      duration: "70ms",
    });
    expect(snapshot('data-animation="true"', "collapsible").animated).toBe(
      true,
    );
  });

  test("data-animation-easing passes any non-empty value", () => {
    expect(
      snapshot(
        'data-animation-easing="cubic-bezier(0.4, 0, 0.2, 1)"',
        "collapsible",
      ).easing,
    ).toBe("cubic-bezier(0.4, 0, 0.2, 1)");
  });

  test("new attrs win over legacy attrs", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = snapshot(
      'data-animation="true" data-animated="false" data-animation-easing="ease" data-animation-timing-function="linear"',
      "collapsible",
    );
    expect(result.animated).toBe(true);
    expect(result.easing).toBe("ease");
  });

  test("normalizeAnimationConfig defaults", () => {
    expect(normalizeAnimationConfig(undefined)).toEqual({
      enabled: true,
      duration: 200,
      delay: 0,
      easing: "ease-in-out",
    });
  });
});
