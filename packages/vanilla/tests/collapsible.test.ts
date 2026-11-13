import { fireEvent, waitFor } from "@testing-library/dom";
import { afterEach, describe, expect, test } from "vitest";
import { createDisclosure } from "../src";

function mount(html: string): HTMLElement {
  document.body.innerHTML = html;
  return document.body;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.getElementById("zealakit-collapsible-styles")?.remove();
});

describe("@zealakit/disclosure-vanilla Collapsible", () => {
  test("starts closed by default", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.body.textContent).not.toContain("Panel");
  });

  test("starts open with data-default-open", () => {
    mount(`
      <div data-disclosure data-default-open data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    expect(document.querySelector("button")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.body.textContent).toContain("Panel");
  });

  test("toggles open state", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.body.textContent).toContain("Panel");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.body.textContent).not.toContain("Panel");
  });

  test("does not toggle when disabled", () => {
    mount(`
      <div data-disclosure data-disabled data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.body.textContent).not.toContain("Panel");
  });

  test("forceMount keeps content in the DOM while hidden", async () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content data-force-mount>Panel</div>
      </div>
    `);
    createDisclosure();

    const content = document.querySelector(
      '[data-slot="collapsible-content"]',
    )!;
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute("hidden");
    expect(content).toHaveAttribute("data-state", "closed");

    fireEvent.click(document.querySelector("button")!);
    await waitFor(() => {
      expect(content).not.toHaveAttribute("hidden");
      expect(content).toHaveAttribute("data-state", "open");
    });
  });

  test("sets aria relationship between trigger and content", () => {
    mount(`
      <div data-disclosure data-default-open data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div id="panel-1" data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    expect(trigger.getAttribute("aria-controls")).toBe("panel-1");
    expect(document.getElementById("panel-1")).toHaveTextContent("Panel");
  });

  test("supports nested independent instances", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Outer</button>
        <div data-disclosure-content>
          Outer panel
          <div data-disclosure data-animated="false">
            <button type="button" data-disclosure-trigger>Inner</button>
            <div data-disclosure-content>Inner panel</div>
          </div>
        </div>
      </div>
    `);
    createDisclosure();

    fireEvent.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Outer",
      )!,
    );
    expect(document.body.textContent).toContain("Outer panel");
    expect(document.body.textContent).not.toContain("Inner panel");

    fireEvent.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Inner",
      )!,
    );
    expect(document.body.textContent).toContain("Inner panel");
  });

  test("keeps multiple roots independent", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>One</button>
        <div data-disclosure-content>First</div>
      </div>
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Two</button>
        <div data-disclosure-content>Second</div>
      </div>
    `);
    createDisclosure();

    fireEvent.click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "One",
      )!,
    );
    expect(document.body.textContent).toContain("First");
    expect(document.body.textContent).not.toContain("Second");
  });

  test("animates by default and keeps content mounted while closing", async () => {
    mount(`
      <div data-disclosure>
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(document.body.textContent).toContain("Panel");
    });

    const content = document.querySelector(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    expect(content).toHaveAttribute("data-animated");

    fireEvent.click(trigger);
    expect(document.body.textContent).toContain("Panel");
    expect(content).toHaveAttribute("data-state", "closed");

    fireEvent.transitionEnd(content, {
      propertyName: "grid-template-rows",
    });
    await waitFor(() => {
      expect(document.body.textContent).not.toContain("Panel");
    });
  });

  test("destroy removes listeners and restore allows re-init", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    const controller = createDisclosure();
    const trigger = document.querySelector("button")!;

    controller.destroy();
    expect(trigger).not.toHaveAttribute("aria-expanded");
    fireEvent.click(trigger);
    expect(trigger).not.toHaveAttribute("aria-expanded");

    const content = document.querySelector("[data-disclosure-content]")!;
    expect(content).toHaveAttribute("hidden");

    createDisclosure();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(document.body.textContent).toContain("Panel");
  });

  test("avoids duplicate initialization", () => {
    mount(`
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();
    createDisclosure();

    const trigger = document.querySelector("button")!;
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("refresh picks up dynamically inserted markup", () => {
    mount(`<div id="host"></div>`);
    const controller = createDisclosure(document.getElementById("host"));

    document.getElementById("host")!.innerHTML = `
      <div data-disclosure data-animated="false">
        <button type="button" data-disclosure-trigger>Dynamic</button>
        <div data-disclosure-content>Inserted</div>
      </div>
    `;
    controller.refresh();

    fireEvent.click(document.querySelector("button")!);
    expect(document.body.textContent).toContain("Inserted");
  });

  test("injects collapsible styles once", () => {
    mount(`
      <div data-disclosure>
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();
    expect(
      document.getElementById("zealakit-collapsible-styles"),
    ).not.toBeNull();
    const css =
      document.getElementById("zealakit-collapsible-styles")?.textContent ?? "";
    expect(css).toContain("minmax(0, 0fr)");
    expect(css).toContain("minmax(0, 1fr)");
  });
});
