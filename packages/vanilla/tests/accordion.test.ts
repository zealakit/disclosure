import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { createDisclosure } from "../dist/index.js";
import {
  assertAttr,
  assertFocused,
  assertDisabled,
  click,
  keydown,
} from "./support/dom.ts";

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
  <div data-accordion data-accordion-type="single" data-animation="false">
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

    click(button("General"));
    assert.ok(document.body.textContent.includes("General content"));

    click(button("General"));
    assert.ok(document.body.textContent.includes("General content"));

    click(button("Advanced"));
    assert.ok(!document.body.textContent.includes("General content"));
    assert.ok(document.body.textContent.includes("Advanced content"));
  });

  test("single mode collapsible closes the open item", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animation="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div data-accordion-content>General content</div>
        </section>
      </div>
    `);
    createDisclosure();

    click(button("General"));
    click(button("General"));
    assert.ok(!document.body.textContent.includes("General content"));
  });

  test("multiple mode keeps several items open", () => {
    mount(`
      <div data-accordion data-accordion-type="multiple" data-animation="false">
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

    click(button("General"));
    click(button("Advanced"));
    assert.ok(document.body.textContent.includes("General content"));
    assert.ok(document.body.textContent.includes("Advanced content"));
  });

  test("disabled item does not open", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animation="false">
        <section data-accordion-item data-value="locked" data-disabled>
          <h3><button type="button" data-accordion-trigger>Locked</button></h3>
          <div data-accordion-content>Hidden</div>
        </section>
      </div>
    `);
    createDisclosure();

    const trigger = button("Locked");
    click(trigger);
    assertDisabled(trigger);
    assert.ok(!document.body.textContent.includes("Hidden"));
  });

  test("supports keyboard navigation with Home and End", () => {
    mount(singleFixture);
    createDisclosure();

    const general = button("General");
    const advanced = button("Advanced");
    general.focus();

    keydown(general, "ArrowDown");
    assertFocused(advanced);

    keydown(advanced, "Home");
    assertFocused(general);

    keydown(general, "End");
    assertFocused(advanced);
  });

  test("exposes accordion accessibility relationships", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-default-value="general" data-animation="false">
        <section data-accordion-item data-value="general">
          <h3><button type="button" data-accordion-trigger>General</button></h3>
          <div id="general-content" data-accordion-content>General content</div>
        </section>
      </div>
    `);
    createDisclosure();

    const trigger = button("General");
    assertAttr(trigger, "aria-expanded", "true");
    const panel = document.getElementById(
      trigger.getAttribute("aria-controls") ?? "",
    );
    assertAttr(panel, "role", "region");
    assertAttr(panel, "aria-labelledby", trigger.id);
    assert.equal(
      trigger.closest('[data-slot="accordion-heading"]')?.tagName,
      "H3",
    );
  });

  test("supports nested accordions", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-collapsible data-animation="false">
        <section data-accordion-item data-value="outer">
          <h3><button type="button" data-accordion-trigger>Outer</button></h3>
          <div data-accordion-content>
            Outer content
            <div data-accordion data-accordion-type="single" data-collapsible data-animation="false">
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

    click(button("Outer"));
    assert.ok(document.body.textContent.includes("Outer content"));
    assert.ok(!document.body.textContent.includes("Inner content"));

    click(button("Inner"));
    assert.ok(document.body.textContent.includes("Inner content"));
  });

  test("respects data-default-value", () => {
    mount(`
      <div data-accordion data-accordion-type="single" data-default-value="advanced" data-animation="false">
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

    assert.ok(document.body.textContent.includes("Advanced content"));
    assert.ok(!document.body.textContent.includes("General content"));
  });
});
