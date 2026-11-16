import assert from "node:assert/strict";

export function resetDom(): void {
  document.body.replaceChildren();
  document.getElementById("zealakit-collapsible-styles")?.remove();
}

function ownText(element: Element): string {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent ?? "")
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function fail(what: string): never {
  throw new Error(`Unable to find ${what}`);
}

export function getByRole(
  role: "button",
  options: { name: string },
): HTMLElement {
  const match = Array.from(
    document.querySelectorAll<HTMLElement>(`${role}, [role="${role}"]`),
  ).find((node) => (node.textContent ?? "").trim() === options.name);
  return match ?? fail(`role=${role} name=${options.name}`);
}

export function queryByText(text: string): HTMLElement | null {
  return (
    Array.from(document.body.querySelectorAll<HTMLElement>("*")).find(
      (node) => ownText(node) === text,
    ) ?? null
  );
}

export function getByText(text: string): HTMLElement {
  return queryByText(text) ?? fail(`text=${text}`);
}

export async function waitFor(
  check: () => void,
  timeout = 1000,
): Promise<void> {
  const deadline = Date.now() + timeout;
  for (;;) {
    try {
      check();
      return;
    } catch (error) {
      if (Date.now() > deadline) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

export async function findByText(text: string): Promise<HTMLElement> {
  let found: HTMLElement | null = null;
  await waitFor(() => {
    found = getByText(text);
  });
  return found as unknown as HTMLElement;
}

export function click(element: Element): void {
  element.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
}

export function keydown(element: Element, key: string): void {
  element.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }),
  );
}

export function fireTransitionEnd(
  element: Element,
  propertyName = "grid-template-rows",
): void {
  const event = new Event("transitionend", { bubbles: true });
  Object.defineProperty(event, "propertyName", { value: propertyName });
  element.dispatchEvent(event);
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
