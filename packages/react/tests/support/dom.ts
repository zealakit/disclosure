import assert from "node:assert/strict";

export function resetDom(): void {
  document.body.replaceChildren();
  document.getElementById("zealakit-collapsible-styles")?.remove();
}

export function assertConnected(element: Element | null): void {
  assert.ok(element?.isConnected, "expected element to be in the document");
}

export function assertAttr(
  element: Element | null,
  name: string,
  value?: string,
): void {
  assert.ok(element, `expected element with attribute ${name}`);
  assert.ok(element.hasAttribute(name), `expected attribute ${name}`);
  if (value !== undefined) {
    assert.equal(element.getAttribute(name), value);
  }
}

export function assertNoAttr(element: Element | null, name: string): void {
  assert.ok(element, "expected an element");
  assert.equal(
    element.hasAttribute(name),
    false,
    `unexpected attribute ${name}`,
  );
}

export function assertFocused(element: Element | null): void {
  assert.equal(document.activeElement, element);
}

export function assertDisabled(element: Element | null): void {
  assert.ok(element, "expected an element");
  assert.equal((element as HTMLButtonElement).disabled, true);
}

export function assertText(element: Element | null, text: string): void {
  assert.ok(element, "expected an element");
  assert.ok((element.textContent ?? "").includes(text));
}

export function assertClass(element: Element | null, className: string): void {
  assert.ok(element, "expected an element");
  assert.ok(element.classList.contains(className));
}

export function assertMatchObject(actual: unknown, subset: object): void {
  assert.ok(actual && typeof actual === "object", "expected an object");
  for (const [key, value] of Object.entries(subset)) {
    assert.deepEqual((actual as Record<string, unknown>)[key], value);
  }
}

type Mock = { mock: { calls: Array<{ arguments: unknown[] }> } };

export function assertCalledWith(fn: Mock, ...args: unknown[]): void {
  assert.ok(
    fn.mock.calls.some((call) => {
      try {
        assert.deepEqual(call.arguments, args);
        return true;
      } catch {
        return false;
      }
    }),
    "expected mock to be called with the given arguments",
  );
}

export function assertLastCalledWith(fn: Mock, ...args: unknown[]): void {
  assert.deepEqual(fn.mock.calls.at(-1)?.arguments, args);
}
