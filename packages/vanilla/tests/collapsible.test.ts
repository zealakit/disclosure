import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import { createDisclosure } from "../dist/index.js";
import {
  assertAttr,
  assertNoAttr,
  assertDisabled,
  assertConnected,
  assertText,
  click,
  fireTransitionEnd,
  waitFor,
} from "./support/dom.ts";

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
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    assertAttr(trigger, "aria-expanded", "false");
    assert.ok(!document.body.textContent.includes("Panel"));
  });

  test("starts open with data-default-open", () => {
    mount(`
      <div data-disclosure data-default-open data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    assertAttr(document.querySelector("button"), "aria-expanded", "true");
    assert.ok(document.body.textContent.includes("Panel"));
  });

  test("toggles open state", () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    assert.ok(document.body.textContent.includes("Panel"));

    click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.ok(!document.body.textContent.includes("Panel"));
  });

  test("does not toggle when disabled", () => {
    mount(`
      <div data-disclosure data-disabled data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    assertDisabled(trigger);
    click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
    assert.ok(!document.body.textContent.includes("Panel"));
  });

  test("forceMount keeps content in the DOM while hidden", async () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content data-force-mount>Panel</div>
      </div>
    `);
    createDisclosure();

    const content = document.querySelector(
      '[data-slot="collapsible-content"]',
    )!;
    assertConnected(content);
    assertAttr(content, "hidden");
    assertAttr(content, "data-state", "closed");

    click(document.querySelector("button")!);
    await waitFor(() => {
      assertNoAttr(content, "hidden");
      assertAttr(content, "data-state", "open");
    });
  });

  test("sets aria relationship between trigger and content", () => {
    mount(`
      <div data-disclosure data-default-open data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div id="panel-1" data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();

    const trigger = document.querySelector("button")!;
    assert.equal(trigger.getAttribute("aria-controls"), "panel-1");
    assertText(document.getElementById("panel-1"), "Panel");
  });

  test("supports nested independent instances", () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Outer</button>
        <div data-disclosure-content>
          Outer panel
          <div data-disclosure data-animation="false">
            <button type="button" data-disclosure-trigger>Inner</button>
            <div data-disclosure-content>Inner panel</div>
          </div>
        </div>
      </div>
    `);
    createDisclosure();

    click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Outer",
      )!,
    );
    assert.ok(document.body.textContent.includes("Outer panel"));
    assert.ok(!document.body.textContent.includes("Inner panel"));

    click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Inner",
      )!,
    );
    assert.ok(document.body.textContent.includes("Inner panel"));
  });

  test("keeps multiple roots independent", () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>One</button>
        <div data-disclosure-content>First</div>
      </div>
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Two</button>
        <div data-disclosure-content>Second</div>
      </div>
    `);
    createDisclosure();

    click(
      Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "One",
      )!,
    );
    assert.ok(document.body.textContent.includes("First"));
    assert.ok(!document.body.textContent.includes("Second"));
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
    click(trigger);
    await waitFor(() => {
      assert.ok(document.body.textContent.includes("Panel"));
    });

    const content = document.querySelector(
      '[data-slot="collapsible-content"]',
    ) as HTMLElement;
    assertAttr(content, "data-animated");

    click(trigger);
    assert.ok(document.body.textContent.includes("Panel"));
    assertAttr(content, "data-state", "closed");

    fireTransitionEnd(content, "grid-template-rows");
    await waitFor(() => {
      assert.ok(!document.body.textContent.includes("Panel"));
    });
  });

  test("destroy removes listeners and restore allows re-init", () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    const controller = createDisclosure();
    const trigger = document.querySelector("button")!;

    controller.destroy();
    assertNoAttr(trigger, "aria-expanded");
    click(trigger);
    assertNoAttr(trigger, "aria-expanded");

    const content = document.querySelector("[data-disclosure-content]")!;
    assertAttr(content, "hidden");

    createDisclosure();
    click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    assert.ok(document.body.textContent.includes("Panel"));
  });

  test("avoids duplicate initialization", () => {
    mount(`
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();
    createDisclosure();

    const trigger = document.querySelector("button")!;
    click(trigger);
    assertAttr(trigger, "aria-expanded", "true");
    click(trigger);
    assertAttr(trigger, "aria-expanded", "false");
  });

  test("refresh picks up dynamically inserted markup", () => {
    mount(`<div id="host"></div>`);
    const controller = createDisclosure(document.getElementById("host"));

    document.getElementById("host")!.innerHTML = `
      <div data-disclosure data-animation="false">
        <button type="button" data-disclosure-trigger>Dynamic</button>
        <div data-disclosure-content>Inserted</div>
      </div>
    `;
    controller.refresh();

    click(document.querySelector("button")!);
    assert.ok(document.body.textContent.includes("Inserted"));
  });

  test("injects collapsible styles once", () => {
    mount(`
      <div data-disclosure>
        <button type="button" data-disclosure-trigger>Toggle</button>
        <div data-disclosure-content>Panel</div>
      </div>
    `);
    createDisclosure();
    assert.notEqual(
      document.getElementById("zealakit-collapsible-styles"),
      null,
    );
    const css =
      document.getElementById("zealakit-collapsible-styles")?.textContent ?? "";
    assert.ok(css.includes("minmax(0, 0fr)"));
    assert.ok(css.includes("minmax(0, 1fr)"));
  });
});
