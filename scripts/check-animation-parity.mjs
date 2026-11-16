#!/usr/bin/env node
// Checks the shared animation contract (plans/01-animation-config.md §7).
//  1. packages/*/src/animation.ts are identical (Svelte may use `.js` specifiers).
//  2. The shared types match @zealakit/overlay when ../overlay is checked out.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packages = ["react", "vue", "svelte", "vanilla"];
const overlayPath = resolve(
  root,
  "../overlay/packages/core/src/types/animation.ts",
);

const OVERLAY_ONLY_FIELDS = new Set(["type", "direction", "custom"]);
const SHARED_TYPES = [
  "AnimationTimingFunction",
  "AnimationEasing",
  "AnimationConfig",
  "AnimationSetting",
  "ResolvedAnimationConfig",
];

let failed = false;
const fail = (message) => {
  failed = true;
  console.error(`✗ ${message}`);
};

const read = (path) => readFileSync(path, "utf8");

// 1. Intra-repo parity
const normalizeImports = (source) =>
  source.replace(/(from\s+"\.[^"]*?)\.js"/g, '$1"');
const sources = packages.map((name) => {
  const path = join(root, "packages", name, "src", "animation.ts");
  return { name, text: normalizeImports(read(path)) };
});
for (const source of sources.slice(1)) {
  if (source.text !== sources[0].text) {
    fail(
      `packages/${source.name}/src/animation.ts differs from packages/${sources[0].name}/src/animation.ts`,
    );
  }
}
if (!failed) {
  console.log("✓ packages/*/src/animation.ts are identical");
}

// 2. Cross-repo parity
function extractDeclaration(text, name) {
  const start = text.search(new RegExp(`^export type ${name}\\b`, "m"));
  if (start === -1) {
    return null;
  }
  // Include the JSDoc directly above the declaration.
  const before = text.slice(0, start);
  const docStart = before.lastIndexOf("/**");
  const hasDoc =
    docStart !== -1 && /^\/\*\*[\s\S]*?\*\/\s*$/.test(before.slice(docStart));
  const from = hasDoc ? docStart : start;
  // The declaration ends at the first `;` outside braces/parens.
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const char = text[i];
    if (char === "{" || char === "(") depth += 1;
    else if (char === "}" || char === ")") depth -= 1;
    else if (char === ";" && depth === 0) {
      return text.slice(from, i + 1);
    }
  }
  return null;
}

function dropOverlayOnlyFields(declaration) {
  const lines = declaration.split("\n");
  const out = [];
  let pending = [];
  for (const line of lines) {
    const field = line.match(/^\s+(\w+)\??:/);
    if (/^\s*(\/\*\*|\*)/.test(line) || /^\s*\*\//.test(line)) {
      if (line.trim().startsWith("/**") && line.includes("*/")) {
        pending = [line];
      } else {
        pending.push(line);
      }
      continue;
    }
    if (field) {
      if (!OVERLAY_ONLY_FIELDS.has(field[1])) {
        out.push(...pending, line);
      }
      pending = [];
      continue;
    }
    out.push(...pending, line);
    pending = [];
  }
  return out.join("\n");
}

function canonical(declaration, name) {
  let text = dropOverlayOnlyFields(declaration);
  if (name === "AnimationSetting") {
    // Doc states the on/off default, which differs by design (§7.2).
    text = text.replace(/\/\*\*[\s\S]*?\*\/\s*/, "");
  }
  return text
    .replace(/Defaults to \d+\./g, "Defaults to N.")
    .replace(/\s+/g, " ")
    .trim();
}

function sharedBlock(text) {
  const start = text.indexOf("// ── shared with @zealakit/overlay");
  const end = text.indexOf("// ── end shared");
  if (start === -1 || end === -1) {
    throw new Error("shared-block markers not found in animation.ts");
  }
  return text.slice(start, end);
}

if (!existsSync(overlayPath)) {
  console.log("overlay not found, skipping cross-repo check");
} else {
  const overlay = read(overlayPath);
  const disclosure = sharedBlock(sources[0].text);
  const before = failed;
  for (const name of SHARED_TYPES) {
    const a = extractDeclaration(overlay, name);
    const b = extractDeclaration(disclosure, name);
    if (!a || !b) {
      fail(`${name}: missing in ${a ? "disclosure" : "overlay"}`);
    } else if (canonical(a, name) !== canonical(b, name)) {
      fail(
        `${name}: differs between overlay and disclosure\n  overlay:    ${canonical(a, name)}\n  disclosure: ${canonical(b, name)}`,
      );
    }
  }
  for (const constant of [
    "DEFAULT_ANIMATION_DURATION",
    "DEFAULT_ANIMATION_DELAY",
    "DEFAULT_ANIMATION_EASING",
  ]) {
    const re = new RegExp(`export const ${constant}\\b`);
    if (!re.test(overlay) || !re.test(sources[0].text)) {
      fail(`${constant}: missing in one of the repos`);
    }
  }
  if (
    !/export function normalizeAnimationConfig\(\s*setting: AnimationSetting \| undefined,?\s*\): ResolvedAnimationConfig/.test(
      sources[0].text,
    )
  ) {
    fail("normalizeAnimationConfig signature changed");
  }
  if (failed === before) {
    console.log("✓ shared animation types match @zealakit/overlay");
  }
}

process.exit(failed ? 1 : 0);
