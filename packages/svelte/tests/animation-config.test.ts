import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import type { AnimationConfig } from "../dist/index.js";
import Fixture from "./fixtures/animation-option.svelte";
import {
  render,
  cleanup,
  getByText,
  queryByText,
  click,
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

function snapshot() {
  const content = getByText("Panel").closest(
    '[data-slot="collapsible-content"]',
  ) as HTMLElement;
  return {
    animated: content.hasAttribute("data-animated"),
    style: content.getAttribute("style"),
  };
}

function renderWith(props: Record<string, unknown>) {
  const view = render(Fixture, { props });
  const result = snapshot();
  view.unmount();
  return result;
}

describe("@zealakit/disclosure-svelte animation option", () => {
  test("default style text is unchanged", () => {
    assert.equal(
      renderWith({}).style,
      "--collapsible-animation-duration: 200ms; --collapsible-animation-easing: ease-in-out; --collapsible-animation-delay: 0ms;",
    );
  });

  test("animation option maps to CSS variables and presence", () => {
    assert.equal(renderWith({ animation: false }).animated, false);
    assert.ok(
      (
        renderWith({
          animation: { duration: 320, delay: 40, easing: "linear" },
        }).style ?? ""
      ).includes(
        "--collapsible-animation-duration: 320ms; --collapsible-animation-easing: linear; --collapsible-animation-delay: 40ms;",
      ),
    );
  });

  test("animation={false} unmounts immediately on close", async () => {
    render(Fixture, { props: { animation: false } });
    await click(getByText("Toggle"));
    assert.equal(queryByText("Panel"), null);
  });
});
