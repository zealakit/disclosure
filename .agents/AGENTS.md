# Agent instructions (Disclosure)

This repo is a **pnpm monorepo** of headless disclosure primitives (`Collapsible`, `Accordion`) for React, Vue, Svelte, and Vanilla JS. There is **no shared runtime package** — each package is independent.

This file is the root agent guidance. `.agents/` is the single source of truth for
repository-specific AI instructions: `AGENTS.md`, `CLAUDE.md`, and `.cursor/` are symlinks
into it — never duplicate instruction content outside `.agents/`.

## Always follow

- **Architecture:** [.agents/skills/disclosure/SKILL.md](skills/disclosure/SKILL.md) — layout, package boundaries, animation/a11y conventions
- **README skill:** [.agents/skills/readme-system/SKILL.md](skills/readme-system/SKILL.md)
  (load it before touching any README)
- **Rules:** [.agents/rules/](rules/)

Load the disclosure skill before code, test, docs, or release work. Copy and adapt it only
when adding support for another source tree; keep hard rules here.

## Quick map

| Area | Path |
| --- | --- |
| React package | `packages/react/` (`@zealakit/disclosure-react`) |
| Vue package | `packages/vue/` (`@zealakit/disclosure-vue`) |
| Svelte package | `packages/svelte/` (`@zealakit/disclosure-svelte`) |
| Vanilla package | `packages/vanilla/` (`@zealakit/disclosure-vanilla`) |
| Examples | `examples/{react,vue,svelte,vanilla,nextjs}/` |
| Cover / assets | `assets/images/` |
| Docs | Root + per-package `README.md`, `README_VI.md`, `README_CN.md` |
| User-facing integration skills | `skills/disclosure-*.md` |
| Agent skills | `.agents/skills/{disclosure,readme-system}/SKILL.md` |
| Publish script | `scripts/npm-publish.ts` |
| Packaging helper | `scripts/pack-packages.mjs` |
| README structure check | `scripts/check-readmes.mjs` |
| Animation parity check | `scripts/check-animation-parity.mjs` |
| Plans (proposals, not docs) | `plans/` |
| Dependency UI | `monitor/` (`pnpm monitor`) |

## Commands

```bash
pnpm install
pnpm build           # build all four packages (tsc; svelte-package for Svelte)
pnpm test            # Node test runner + happy-dom; builds each package first
pnpm typecheck       # source + tests type check
pnpm lint            # Biome
pnpm check           # build + typecheck + test + lint + animation parity
pnpm check:animation # shared animation.ts files match each other and ../overlay
pnpm clean           # remove build output and local tarballs
pnpm pack:packages   # pack the four tarballs into artifacts/ (no publish)
pnpm release:check   # full checks + tarballs (no publish)
pnpm readme:check    # README structure: EN/VI/CN parity, absolute links, H1 = package name

pnpm dev:react
pnpm dev:vue
pnpm dev:svelte
pnpm dev:vanilla
pnpm dev:nextjs

pnpm npm:publish:check # build + test + inspect all four packages (no publish)
pnpm npm:publish:react # or npm:publish:vue / npm:publish:svelte / npm:publish:vanilla / npm:publish:all

pnpm monitor         # local dependency UI at http://127.0.0.1:4177
```

## Docs

Keep EN / VI / CN READMEs in sync when changing API or usage; structure and link rules are in
the [readme-system skill](skills/readme-system/SKILL.md).

## Hard boundaries

- **Package independence:** no shared runtime package, and no package imports another.
- **Headless:** no colors, icons, or layout opinions. The only CSS shipped is the structural
  height-animation stylesheet (`styles.ts`).
- **Shared behavior is mirrored, not shared:** animation config, `forceMount`, the presence
  lifecycle, and a11y stay aligned across the four packages. Vanilla mirrors them through
  `data-*` attributes. `pnpm check:animation` enforces that the `animation.ts` files match.
- **Shared animation contract:** the shared block in `packages/*/src/animation.ts` mirrors
  `@zealakit/overlay`, so change both repos together and run `pnpm check:animation`.
- **SSR safety:** never touch `window`, `document`, or `matchMedia` during module
  initialization or during React/Vue/Svelte render. Guard DOM work behind lifecycle effects.
- **TypeScript:** `type` aliases, not `interface`; `import type` for type-only imports; ESM
  with explicit `.js` relative specifiers.
- **Naming:** files and folders are `kebab-case`; exported components are `PascalCase`.
- **Build:** `tsc` for React/Vue/Vanilla and `svelte-package` for Svelte. No bundler. ESM only.
  `packages/vue/src` has no `.vue` files.
- **Package surface:** do not export speculative or unimplemented APIs. No placeholder
  components, no fake implementations.
- **Tests:** changes need focused tests in the owning package (`packages/*/tests/`, `.ts` only;
  Node test runner + happy-dom against `dist`). Do not add a second test framework or DOM
  library.
- **Documentation:** there is intentionally no `docs/` folder. Product documentation lives only
  in the root and package READMEs (EN, VI, CN), following the
  [readme-system skill](skills/readme-system/SKILL.md). `examples/` are runnable integration
  references, and `plans/` are proposals, not docs.

## Definition of done

`pnpm check` and `pnpm readme:check` pass. Examples still build against the local workspace
packages (including `examples/nextjs`). Update this file and the
[skill](skills/disclosure/SKILL.md) when boundaries, commands, or workflows change.
