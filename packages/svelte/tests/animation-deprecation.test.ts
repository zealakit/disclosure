import { cleanup, render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import Fixture from "./fixtures/animation-option.svelte";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderWith(props: Record<string, unknown>) {
  render(Fixture, { props }).unmount();
}

describe("@zealakit/disclosure-svelte legacy deprecation warnings", () => {
  test("legacy props warn once; animation does not warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWith({ animation: { duration: 1 } });
    expect(warn).not.toHaveBeenCalled();
    renderWith({ animationDuration: 1 });
    renderWith({ animationDuration: 2 });
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(
      messages.filter((m) => m.includes("animationDuration")),
    ).toHaveLength(1);
  });
});
