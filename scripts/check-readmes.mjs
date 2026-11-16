#!/usr/bin/env node
// Verifies the README system described in .agents/skills/readme-system/SKILL.md.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://github.com/zealakit/disclosure/blob/main";
const files = ["README.md", "README_VI.md", "README_CN.md"];
const units = [
  { dir: "", name: "Zealakit Disclosure" },
  ...["vanilla", "react", "vue", "svelte"].map((pkg) => ({
    dir: `packages/${pkg}`,
    name: JSON.parse(
      readFileSync(join(root, "packages", pkg, "package.json"), "utf8"),
    ).name,
  })),
];

const errors = [];
const fail = (message) => errors.push(message);

const strip = (text) =>
  text.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ""));

const headings = (text) =>
  [...text.matchAll(/^(#{1,6}) (.+)$/gm)].map(
    (match) => `${match[1]} ${match[2]}`,
  );

const codeBlocks = (text) =>
  [...text.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => m[0]);

const tableShapes = (text) =>
  strip(text)
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map((line) => (line.match(/(?<!\\)\|/g) ?? []).length);

for (const { dir, name } of units) {
  const texts = {};
  for (const file of files) {
    const path = join(root, dir, file);
    if (!existsSync(path)) {
      fail(`${join(dir, file)} is missing`);
      continue;
    }
    texts[file] = readFileSync(path, "utf8");
  }
  const english = texts["README.md"];
  if (!english) continue;

  if (!english.startsWith(`# ${name}\n`)) {
    fail(`${join(dir, "README.md")}: H1 must be "# ${name}"`);
  }

  for (const file of files) {
    const text = texts[file];
    if (!text) continue;
    const where = join(dir, file);
    const prose = strip(text);

    if (/\]\((?!https?:\/\/|#|mailto:)/.test(prose)) {
      fail(`${where}: relative link found`);
    }
    if (/!\[[^\]]*\]\((?!https?:\/\/)/.test(prose)) {
      fail(`${where}: image must use an absolute URL`);
    }
    if (
      /\]\(https:\/\/github\.com\/zealakit\/disclosure\/blob\/main[^)]*\.(png|jpe?g|gif|svg)(?!\?raw=true)/.test(
        prose,
      )
    ) {
      fail(`${where}: image URL must end with ?raw=true`);
    }
    if (!prose.includes("> **Note**")) fail(`${where}: missing > **Note**`);
    if (/\bTODO\b/.test(prose)) fail(`${where}: contains TODO`);
    for (const language of files) {
      const suffix = dir ? `${dir}/${language}` : language;
      if (!text.includes(`](${base}/${suffix})`)) {
        fail(`${where}: language switcher misses ${suffix}`);
      }
    }

    if (file === "README.md") continue;
    const same = (label, a, b) => {
      if (JSON.stringify(a) !== JSON.stringify(b))
        fail(`${where}: ${label} differ from README.md`);
    };
    same("headings", headings(strip(english)), headings(prose));
    same("code blocks", codeBlocks(english), codeBlocks(text));
    same("table shapes", tableShapes(english), tableShapes(text));
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`README check passed (${units.length * files.length} files).`);
