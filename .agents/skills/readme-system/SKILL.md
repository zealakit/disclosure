---
name: readme-system
description: >-
  Use when creating, editing, translating, or reviewing READMEs for a library or monorepo
  (root and package). Provides a reusable hub-and-spoke README system: file layout, section
  order, table/code/link rules, voice, translation parity, and a pre-flight checklist. Adapt
  the Profile section when copying the skill to another repository.
---

# README system (hub + spoke)

One root README for navigation; one README per published unit holding the full API. Each
README must read well on GitHub and npm. English is the source; translation files mirror it.

This skill is a reusable template. Everything repository-specific lives in
[Profile](#0-profile). When copying it to another source tree, edit that block, map the units
to layouts in [section 3](#3-unit-readme-layout-profiles), delete what the target repo does
not use, then run its checker.

## 0. Profile

Fill this once per repository. The values below are the current values for this repo; replace
them when porting. Rules later reference the keys, not the literal values.

| Key | Current value | Used by |
| --- | --- | --- |
| Project name | `Zealakit Disclosure` | Root H1, cover alt text |
| Org / repo | `zealakit/disclosure` | Absolute links |
| Absolute base | `https://github.com/zealakit/disclosure/blob/main` | Every cross-link |
| Cover image | `<base>/assets/images/disclosure-cover.jpg?raw=true` | Root + unit READMEs |
| License line | `MIT © Zealakit` | Last section |
| Languages | EN `README.md`, VI `README_VI.md`, CN `README_CN.md` | Switcher, parity |
| Units | root + `packages/{react,vue,svelte,vanilla}` | File set, checker |
| Layouts | react/vue/svelte → component; vanilla → adapter | Section 3 |
| Package READMEs excluded | `examples/`, `monitor/`, `plans/` | File structure |
| Internal agent skills | `.agents/skills/{disclosure,readme-system}/SKILL.md` | Never linked from user-facing READMEs |
| User-facing integration skills | `skills/disclosure-*.md` | Root `## Agent Skills` + package `## Agent Skill` links |
| Checker | `pnpm readme:check` | Pre-flight checklist |
| Architecture skill | `.agents/skills/disclosure/SKILL.md` | Optional pre-read |

Canonical `> **Note**` for this repo (same text in every README of one language):

> **Note**
>
> Disclosure is not a replacement for a full UI library. Use it when Accordion or Collapsible in your kit is hard to restyle — or when you only need that one primitive and don’t want to pull in a large design system.

Single-language or single-package repos can delete the language and layout rows they do not
use; the rest of the skill still applies.

## 1. File structure

- Root README plus one README per published unit (package/workspace/crate), in every configured
  language: `README.md` (source language) + `README_<LANG>.md`.
- Private, non-product trees (`examples/`, `tools/`, `monitor/`) do not get READMEs unless the
  host repo treats them as products.
- Headings stay in the source language in all translations so anchors match. Prose, table
  cells, and code comments follow the target language.
- No separate `docs/` app unless the host repo already has one. Design rationale belongs in the
  owning unit README; process guidance belongs in agent skills or `CONTRIBUTING`.
- Translations must match the source README exactly for heading text and order, code block
  contents, and table shape (column count and order). Only prose differs.
- If the repo ships a README checker, it is the source of truth. Read it before changing
  structure; update it when the profile changes.

## 2. Root README: mandatory order

For a multi-unit repo:

1. `# <Project name>`
2. Language switcher: one link per configured language, in profile order, for example
   `[English](<base>/README.md) | [<Language>](<base>/README_<LANG>.md)`.
3. Cover image (optional): `![<Project name> cover](<cover>)`.
4. One tagline sentence (what it is, who it is for), bullets for the top-level units, one
   paragraph on what it does not do.
5. Canonical `> **Note**` scope warning.
6. `## Packages` (or `## Workspace`): table `Unit | Runtime/Framework | Documentation` with
   absolute links, then one sentence that each package installs independently.
7. `## Installation`: one `bash` block with the install commands. No explanation.
8. `## Examples` (only if examples exist): install/build commands and the `dev:*` scripts.
9. Optional end-user sections (playground, benchmarks) only when they help consumers. Omit
   maintainer tooling such as the dependency monitor.
10. `## Agent Skills` (when the repo ships user-facing skills under `skills/`): link each
    framework skill; never link the internal `.agents/skills` files.
11. `## License`.

No badges, screenshot gallery, changelog, roadmap, contributing, or API tables in the root
README. The root is navigation; APIs live in the unit READMEs.

For a single-package repo, sections 1–5 and License are enough; install and API sections live
in the unit README.

## 3. Unit README: layout profiles

Pick one layout per unit in the profile and keep its section order. Every layout shares:
H1 equal to the exact package/unit name, language switcher + cover (reuse the root image),
canonical Note, `## Install`, `## Agent Skill` (when the repo ships a user-facing skill for the
unit), `## License`.

### component layout (framework UI packages)

1. `# <exact package name>`
2. Language switcher + cover.
3. Lead 1: "Headless <A> and <B> for <framework>. Provides <...>. You own visual styling."
4. Lead 2: styling contract — where styles go and the consequence for animation/layout.
5. Canonical Note.
6. `## Install`: one code block plus one line of peer dependency ranges.
7. One `## <Primitive>` per primitive, in root → trigger → content order: `### Quick start`,
   one `### \`<Component>\` props` table per component, `### Controlled usage`,
   `### <Feature> configuration`, `### \`<special prop>\``.
8. Framework-specific section when needed (`## Next.js App Router`, `## Nuxt`,
   `## SvelteKit`).
9. `## Styling hooks`: `Attribute | Where | Purpose`.
10. `## Agent Skill`.
11. `## License`.

Framework-specific extras (composables, controllers/actions, lifecycle) go after the
primitives when the adapter exposes them.

### adapter layout (imperative or non-component wrapper)

Lead paragraphs with the styling contract, Note, `## Install`, `## Public API` (types/options tables), `## Usage` (quick start, options), `## Lifecycle` (create, refresh, destroy; guard against double init), `## Styling hooks`, `## Agent Skill`, `## License`; plus `## Markup` when the adapter owns host attributes, child markers, or
events. Order: Install → Public API → Markup → Usage → Lifecycle → Styling hooks → Agent Skill →
License.

### custom layout

If a unit fits none of the above, document its order at the top of that unit README and keep it
identical across languages. Do not mix layout orders inside one repo without a stated reason.

## 4. Table rules

- Pick one props/options header per repo and keep it; the default is
  `| Prop | Type | Default | Description |`.
- Types in backticks; escape unions as `\|`; no default is `—`; required is `**required**`.
- The last row describes forwarding (`...div props`, `...button props`, or "no other props are
  forwarded").
- One table per component/unit; never merge. Directly under a table, add one or two sentences on
  consequences (attributes set, keyboard support, scope).
- Defaults must match the code. Verify against the source, never from memory.

## 5. Code block rules

- Use the correct fence: `tsx`, `ts`, `vue`, `svelte`, `html`, `bash`, `json`, `css`.
- Keep examples minimal and runnable. Reuse one sample across primitives when possible.
- Imports use the real package name; no hypothetical code.
- Rewrite behavior in each framework's idiom (props vs `v-model`/refs vs `bind:`); never copy a
  block across frameworks.
- Code blocks are identical across translations; the checker may enforce this.

## 6. Link and image rules

- All cross-links and images use absolute URLs (`<base>/...`) because READMEs render on npm too.
- Append `?raw=true` to images when the profile or host repo requires raw GitHub content.
- Deep anchors use `<absolute-file-url>#section-slug`.
- The language switcher lists every configured language in order and points at the right file.
- Never link to local paths, `docs/`, or in-progress branches.

## 7. Voice

Second person, present tense, declarative, short sentences. No marketing, no emoji. Paragraphs
are at most three sentences, then code or a table. State the reason right after the behavior.
Technical terms (props, attributes, CSS variables, component names) are never translated.

## 8. Porting checklist (copying this skill to another repo)

1. Replace every value in [Profile](#0-profile); move repo-specific facts out of the rules.
2. Choose languages: delete unused `README_<LANG>.md` rows, update the switcher and the checker.
3. Map each unit to a layout in [section 3](#3-unit-readme-layout-profiles); delete unused
   layouts.
4. Delete optional root sections the target repo does not have (Examples, playground,
   benchmarks). Link user-facing `skills/*` integration files from the root and unit READMEs,
   never the internal `.agents/skills` files.
5. Point the pre-flight checker to the host command, or remove that checklist item.
6. Remove the architecture-skill reference if the host repo has no such skill.
7. Search for leftover source-repo names (`zealakit`, `overlay`, old package names) after
   copying.

## 9. Pre-flight checklist

- [ ] Root README has no detailed props/API tables.
- [ ] Every unit README stands alone (tagline, Note, Install).
- [ ] Units of the same layout share section order.
- [ ] Every heading, table shape, and code block matches across translations.
- [ ] No relative links; no `TODO`.
- [ ] H1 equals the package/unit name.
- [ ] Defaults and peer ranges match the code and manifest.
- [ ] The language switcher resolves for every configured language.
- [ ] The checker command passes, if one is configured.
