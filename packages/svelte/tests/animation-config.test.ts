import { cleanup, fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { AnimationConfig } from "../src";
import Fixture from "./fixtures/animation-option.svelte";

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

function snapshot() {
  const content = screen
    .getByText("Panel")
    .closest('[data-slot="collapsible-content"]') as HTMLElement;
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
    expect(renderWith({}).style).toBe(
      "--collapsible-animation-duration: 200ms; --collapsible-animation-easing: ease-in-out; --collapsible-animation-delay: 0ms;",
    );
  });

  test("animation matches legacy props", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(renderWith({ animation: false })).toEqual(
      renderWith({ animated: false }),
    );
    expect(renderWith({ animation: { duration: 320 } })).toEqual(
      renderWith({ animationDuration: 320 }),
    );
  });

  test("animation wins over legacy props", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = renderWith({
      animation: { duration: 50 },
      animationDuration: 999,
      animated: false,
    });
    expect(result.style).toContain("--collapsible-animation-duration: 50ms");
    expect(result.animated).toBe(true);
  });

  test("animation={false} unmounts immediately on close", async () => {
    render(Fixture, { props: { animation: false } });
    await fireEvent.click(screen.getByText("Toggle"));
    expect(screen.queryByText("Panel")).toBeNull();
  });
});
