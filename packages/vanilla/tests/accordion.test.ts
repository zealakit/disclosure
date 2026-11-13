import { fireEvent } from "@testing-library/dom";
import { afterEach, describe, expect, test } from "vitest";
import { createDisclosure } from "../src";

function mount(html: string): void {
  document.body.innerHTML = html;
}

function button(name: string): HTMLButtonElement {
  return Array.from(document.querySelectorAll("button")).find(
    (node) => node.textContent?.trim() === name,
  ) as HTMLButtonElement;
}

afterEach(() => {
  document.body.innerHTML = "";
  document.getElementById("zealakit-collapsible-styles")?.remove();
});

const singleFixture = `
  <div data-accordion data-accordion-type="single" data-animated="false">
    <section data-accordion-item data-value="general">
      <h3>
        <button type="button" data-accordion-trigger>General</button>
      </h3>
      <div id="general-content" data-accordion-content>General content</div>
    </section>
    <section data-accordion-item data-value="advanced">
      <h3>
        <button type="button" data-accordion-trigger>Advanced</button>
      </h3>
      <div id="advanced-content" data-accordion-content>Advanced content</div>
    </section>
  </div>
`;

describe("@zealakit/disclosure-vanilla Accordion", () => {
  test("single mode opens one item and keeps it open when collapsible is false", () => {
    mount(singleFixture);
    createDisclosure();

    fireEvent.click(button("General"));
    expect(document.body.textContent).toContain("General content");

    fireEvent.click(button("General"));
    expect(document.body.textContent).toContain("General content");

    fireEvent.click(button("Advanced"));
    expect(document.body.textContent).not.toContain("General content");
    expect(document.body.textContent).toContain("Advanced content");
  });

  test("single mode collapsible closes the open item", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animated="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div data-accordion-content>General content</div>
        </section>
      </div>
    `);
    createDisclosure();

    fireEvent.click(button("General"));
    fireEvent.click(button("General"));
    expect(document.body.textContent).not.toContain("General content");
  });

  test("multiple mode keeps several items open", () => {
    mount(`
      <div data-accordion data-accordion-type="multiple" data-animated="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div data-accordion-content>General content</div>
        </section>
        <section data-accordion-item data-value="advanced">
          <h3><button type="button" data-accordion-trigger>Advanced</button></h3>
          <div data-accordion-content>Advanced content</div>
        </section>
      </div>
    `);
    createDisclosure();

    fireEvent.click(button("General"));
    fireEvent.click(button("Advanced"));
    expect(document.body.textContent).toContain("General content");
    expect(document.body.textContent).toContain("Advanced content");
  });

  test("disabled item does not open", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animated="false">
        <section data-accordion-item data-value="locked" data-disabled>
          <h3><button type="button" data-accordion-trigger>Locked</button></h3>
          <div data-accordion-content>Hidden</div>
        </section>
      </div>
    `);
    createDisclosure();

    const trigger = button("Locked");
    fireEvent.click(trigger);
    expect(trigger).toBeDisabled();
    expect(document.body.textContent).not.toContain("Hidden");
  });

  test("supports keyboard navigation with Home and End", () => {
    mount(singleFixture);
    createDisclosure();

    const general = button("General");
    const advanced = button("Advanced");
    general.focus();

    fireEvent.keyDown(general, { key: "ArrowDown" });
    expect(advanced).toHaveFocus();

    fireEvent.keyDown(advanced, { key: "Home" });
    expect(general).toHaveFocus();

    fireEvent.keyDown(general, { key: "End" });
    expect(advanced).toHaveFocus();
  });

  test("exposes accordion accessibility relationships", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-default-value="general" data-animated="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div id="general-content" data-accordion-content>General content</div>
        </section>
      </div>
    `);
    createDisclosure();

    const trigger = button("General");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    expect(panel).toHaveAttribute("role", "region");
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(trigger.closest('[data-slot="accordion-heading"]')?.tagName).toBe(
      "H3",
    );
  });

  test("supports nested accordions", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animated="false">
        <section data-accordion-item data-value="outer">
          <h3><button type="button" data-accordion-trigger>Outer</button></h3>
          <div data-accordion-content>
            Outer content
            <div data-accordion data-accordion-type="single" data-collapsible data-animated="false">
              <section data-accordion-item data-value="inner">
                <h3><button type="button" data-accordion-trigger>Inner</button></h3>
                <div data-accordion-content>Inner content</div>
              </section>
            </div>
          </div>
        </section>
      </div>
    `);
    createDisclosure();

    fireEvent.click(button("Outer"));
    expect(document.body.textContent).toContain("Outer content");
    expect(document.body.textContent).not.toContain("Inner content");

    fireEvent.click(button("Inner"));
    expect(document.body.textContent).toContain("Inner content");
  });

  test("respects data-default-value", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-default-value="advanced" data-animated="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div data-accordion-content>General content</div>
        </section>
        <section data-accordion-item data-value="advanced">
          <h3><button type="button" data-accordion-trigger>Advanced</button></h3>
          <div data-accordion-content>Advanced content</div>
        </section>
      </div>
    `);
    createDisclosure();

    expect(document.body.textContent).toContain("Advanced content");
    expect(document.body.textContent).not.toContain("General content");
  });
});
