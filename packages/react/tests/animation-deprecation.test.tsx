import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Collapsible, CollapsibleContent } from "../src";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderWith(props: Record<string, unknown>) {
  render(
    <Collapsible defaultOpen {...props}>
      <CollapsibleContent>Panel</CollapsibleContent>
    </Collapsible>,
  );
}

describe("legacy deprecation warnings", () => {
  test("each legacy prop warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWith({ animationDelay: 1 });
    renderWith({ animationDelay: 2 });
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((m) => m.includes("animationDelay"))).toHaveLength(
      1,
    );
  });

  test("new option does not warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderWith({ animation: { duration: 1 } });
    expect(warn).not.toHaveBeenCalled();
  });
});
