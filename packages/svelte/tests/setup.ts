import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { compile, compileModule } from "svelte/compiler";
import { Window } from "happy-dom";

/** Register a DOM before the built adapter is imported. */
const window = new Window({ url: "http://localhost/" });

const values: Record<string, unknown> = {
  window,
  document: window.document,
  navigator: window.navigator,
  location: window.location,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  SVGElement: window.SVGElement,
  Node: window.Node,
  Text: window.Text,
  Comment: window.Comment,
  DocumentFragment: window.DocumentFragment,
  Document: window.Document,
  HTMLTemplateElement: window.HTMLTemplateElement,
  HTMLInputElement: window.HTMLInputElement,
  HTMLButtonElement: window.HTMLButtonElement,
  Event: window.Event,
  CustomEvent: window.CustomEvent,
  KeyboardEvent: window.KeyboardEvent,
  MouseEvent: window.MouseEvent,
  PointerEvent: window.PointerEvent,
  FocusEvent: window.FocusEvent,
  MutationObserver: window.MutationObserver,
  ResizeObserver: window.ResizeObserver,
  getComputedStyle: window.getComputedStyle.bind(window),
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
};

// Svelte feature-checks DOM classes such as `HTMLMediaElement` when it unmounts.
for (const key of Object.getOwnPropertyNames(window)) {
  if (/^(HTML|SVG)\w*Element$/.test(key) && !(key in values)) {
    values[key] = (window as unknown as Record<string, unknown>)[key];
  }
}

for (const [key, value] of Object.entries(values)) {
  try {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value,
    });
  } catch {
    // Some Node globals may be non-configurable.
  }
}

/** Compile `.svelte` files on import so tests can load the built components. */
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".svelte")) {
      const filename = fileURLToPath(url);
      const { js } = compile(readFileSync(filename, "utf8"), {
        generate: "client",
        filename,
        css: "injected",
      });
      return { format: "module", source: js.code, shortCircuit: true };
    }
    if (/\.svelte\.js$/.test(url)) {
      // Rune modules (`*.svelte.js`) need the Svelte compiler as well.
      const filename = fileURLToPath(url);
      const { js } = compileModule(readFileSync(filename, "utf8"), {
        generate: "client",
        filename,
      });
      return { format: "module", source: js.code, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
