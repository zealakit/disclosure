import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { defineComponent, ref } from "vue";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../src";

afterEach(() => {
  cleanup();
});

describe("@zealakit/disclosure-vue", () => {
  test("starts closed by default", () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animated="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("toggles uncontrolled state", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animated="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Panel")).toBeInTheDocument();

    await fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("supports controlled open via v-model:open", async () => {
    const onOpenChange = vi.fn();
    const Controlled = defineComponent({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      setup() {
        const open = ref(false);
        return { open, onOpenChange };
      },
      template: `
        <Collapsible v-model:open="open" :animated="false" @open-change="onOpenChange">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    render(Controlled);
    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  test("does not toggle when disabled", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible disabled :animated="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    expect(trigger).toBeDisabled();
    expect(screen.queryByText("Panel")).toBeNull();
  });

  test("animates by default and keeps content mounted while closing", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    expect(content).toHaveAttribute("data-animated");

    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByText("Panel")).toBeInTheDocument();
    expect(content).toHaveAttribute("data-state", "closed");

    await fireEvent.transitionEnd(content as HTMLElement, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      expect(screen.queryByText("Panel")).toBeNull();
    });
  });

  test("forceMount keeps content mounted", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible :animated="false">
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent force-mount>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]');
    expect(content).toHaveAttribute("hidden");
    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(content).not.toHaveAttribute("hidden");
    });
  });

  test("applies consumer chrome to the clipped content wrapper", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent class="panel-chrome" style="border-left: 3px solid red; padding: 12px">
            Panel
          </CollapsibleContent>
        </Collapsible>
      `,
    });

    await fireEvent.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    const wrapper = viewport.querySelector(
      "[data-collapsible-content-wrapper]",
    ) as HTMLElement;

    expect(viewport).toHaveAttribute("data-animated");
    expect(viewport.className).not.toContain("panel-chrome");
    expect(wrapper.className).toContain("panel-chrome");
    expect(wrapper.getAttribute("style")).toContain("border-left");
  });

  test("applies animation configuration CSS variables", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible
          :default-open="true"
          animation-timing-function="linear"
          :animation-duration="320"
          :animation-delay="40"
        >
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const content = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;
    expect(content.style.getPropertyValue("--collapsible-animation-easing")).toBe(
      "linear",
    );
    expect(
      content.style.getPropertyValue("--collapsible-animation-duration"),
    ).toBe("320ms");
    expect(content.style.getPropertyValue("--collapsible-animation-delay")).toBe(
      "40ms",
    );
  });

  test("ignores stale close transition after reopen", async () => {
    render({
      components: { Collapsible, CollapsibleTrigger, CollapsibleContent },
      template: `
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Panel</CollapsibleContent>
        </Collapsible>
      `,
    });

    const trigger = screen.getByRole("button", { name: "Toggle" });
    await fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Panel")).toBeInTheDocument();
    });

    const viewport = screen
      .getByText("Panel")
      .closest('[data-slot="collapsible-content"]') as HTMLElement;

    await fireEvent.click(trigger);
    expect(viewport).toHaveAttribute("data-state", "closed");

    await fireEvent.click(trigger);
    await waitFor(() => {
      expect(viewport).toHaveAttribute("data-state", "open");
    });

    await fireEvent.transitionEnd(viewport, {
      propertyName: "grid-template-rows",
    });
    expect(screen.getByText("Panel")).toBeInTheDocument();
  });
});
