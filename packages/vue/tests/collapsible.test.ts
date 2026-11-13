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

describe("@zealakit/collapsible-vue", () => {
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
});
