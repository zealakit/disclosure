import { cleanup, render } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Collapsible, CollapsibleContent } from "../src";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderCollapsible(attrs: string) {
  const view = render({
    components: { Collapsible, CollapsibleContent },
    template: `
      <Collapsible default-open ${attrs}>
        <CollapsibleContent>Panel</CollapsibleContent>
      </Collapsible>`,
  });
  view.unmount();
}

describe("@zealakit/disclosure-vue legacy deprecation warnings", () => {
  test("legacy props warn once; animation does not warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderCollapsible(':animation="{ duration: 1 }"');
    expect(warn).not.toHaveBeenCalled();
    renderCollapsible(':animation-delay="1"');
    renderCollapsible(':animation-delay="2"');
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((m) => m.includes("animationDelay"))).toHaveLength(
      1,
    );
  });
});
