---
name: disclosure
description: >-
  Use for any Disclosure code, test, documentation, or release work: deciding
  where logic belongs, keeping the four packages aligned, validating behavior,
  and packaging releases. Covers headless Collapsible/Accordion for React, Vue,
  Svelte, and Vanilla JS.
---

# Disclosure

Read `.agents/AGENTS.md` first. Keep this file compact; add separate skills only for other source trees.

This repo ships **framework-specific** headless primitives. Keep APIs and behavior aligned across packages without introducing a shared runtime.

## What it is

- **Collapsible** — single open/closed panel
- **Accordion** — grouped panels (single or multiple)
- Behavior + a11y only — consumers own visual styling via `data-slot` / `data-state`
- Built-in CSS grid height animation (`minmax(0, 0fr)` ↔ `minmax(0, 1fr)`), enabled by default
- Respect `prefers-reduced-motion`

## Map

```text
react ───┐
vue ─────┤  four independent packages (no arrows between them)
svelte ──┤
vanilla ─┘

examples/* -> packages
READMEs (EN/VI/CN) -> product documentation
```

- **react:** compound components + context; presence in `use-presence.ts`
- **vue:** components as `.ts` render functions (`defineComponent` + `h()`)
- **svelte:** `.svelte` components + `createPresence` (`use-presence.svelte.ts`)
- **vanilla:** declarative `data-*` markup + `createDisclosure()`
- **Docs** live only in the root and package READMEs (EN, VI, CN), structured by the
  [readme-system skill](../readme-system/SKILL.md). There is no `docs/` folder.

## Package boundaries

| Path | Publish name | Notes |
| --- | --- | --- |
| `packages/react/` | `@zealakit/disclosure-react` | No `"use client"` in the package — apps add it. Peers: React `^18.0.0 \|\| ^19.0.0` |
| `packages/vue/` | `@zealakit/disclosure-vue` | Vue `^3.5.0` |
| `packages/svelte/` | `@zealakit/disclosure-svelte` | Svelte `^5.0.0` |
| `packages/vanilla/` | `@zealakit/disclosure-vanilla` | Declarative `data-*` + `createDisclosure()`; ESM only; no framework peers |

Do **not** add a shared runtime package. Mirror behavior across packages when it is shared (animation config, `forceMount`, presence lifecycle, a11y). Vanilla uses HTML attributes instead of framework props — keep the contract aligned, not the implementation.

## Tree

```text
disclosure/
├── .agents/
│   ├── AGENTS.md                  # hard rules, commands, boundaries
│   ├── rules/disclosure.mdc       # editor always-apply rule
│   └── skills/
│       ├── disclosure/SKILL.md    # this workflow
│       └── readme-system/SKILL.md # README structure spec
├── AGENTS.md    -> .agents/AGENTS.md
├── CLAUDE.md    -> .agents/AGENTS.md
├── .cursor      -> .agents
├── assets/images/                 # README cover image
├── examples/                      # react, vue, svelte, vanilla, nextjs
├── packages/{react,vue,svelte,vanilla}/   # src/ + tests/ + generated dist/
├── monitor/                       # local dependency dashboard
├── plans/                         # proposals, not docs
├── scripts/                       # npm-publish, pack-packages, check-readmes, check-animation-parity
├── skills/                        # user-facing integration skills (disclosure-*.md)
├── README.md, README_VI.md, README_CN.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── biome.json
```

Typical `src/` (per package):

```text
src/
  collapsible.*      # root / trigger / content
  accordion.*        # root / item / trigger / content + context
  *-types.*          # public prop types
  *-context.*        # provide/inject or context
  animation.*        # shared animation config (identical in all four packages)
  use-presence.*     # enter/exit presence (framework-specific)
  styles.*           # structural height-animation stylesheet
  index.*            # public exports
tests/               # setup.ts, support/dom.ts, *.test.ts (React: createElement, no JSX)
```

## Change workflow

1. Identify the owning package(s) and their tests.
2. If behavior is shared, change all four packages in the same change.
3. Use TypeScript `type` aliases, `import type`, explicit `.js` relative imports.
4. Keep imports SSR-safe: no browser globals at module init or during render.
5. Clean up listeners, rAF, and `transitionend` handlers (`destroy()` restores markup in Vanilla).
6. Export only implemented public APIs and their types from `src/index.ts`.
7. Add focused tests in each touched package; run `pnpm check`.
8. Update the READMEs (all three languages) when public behavior changes; load the
   [readme-system skill](../readme-system/SKILL.md) and run `pnpm readme:check`.

### Framework notes

- **React:** context + compound parts; presence via `use-presence.ts`; Strict Mode-safe effects. The package ships without `"use client"`.
- **Vue:** Vue 3.5+; `defineComponent` + `h()` in `.ts` (no SFCs); typed `emits`; `watch` with `flush: "post"` in presence; `provide`/`inject` contexts.
- **Svelte:** Svelte 5 runes; `createPresence` in `use-presence.svelte.ts`; built with `svelte-package`; tests compile `.svelte` fixtures (and `*.svelte.js` modules) through `registerHooks` in `tests/setup.ts`.
- **Vanilla:** `createDisclosure(root?)`, `refresh()` / `destroy()`; closed content detaches through a placeholder comment; `destroy()` restores author markup.

## Animation / DOM rules

- Animate height on the **viewport**; put borders/padding/backgrounds on the **inner content wrapper** (`data-collapsible-content-wrapper`), not the animated viewport.
- Use `minmax(0, …)` floors — bare `0fr` can leave exit artifacts.
- Expose animation through one `animation` option (`boolean | AnimationConfig`: `enabled`, `duration`, `delay`, `easing`), consistently across frameworks. Vanilla uses `data-animation` and `data-animation-{duration,delay,easing}`.
- **Shared animation contract:** the shared block in `packages/*/src/animation.ts` mirrors `@zealakit/overlay`. When you change it, apply the same change in the sibling repo and run `pnpm check:animation`.
- Intentional differences from Overlay: animation is **on** by default, default duration is 200ms, and there is no `type` / `direction`.

## Verification

```bash
pnpm --filter @zealakit/disclosure-<pkg> run typecheck
pnpm --filter @zealakit/disclosure-<pkg> run test
pnpm check
```

- Tests use Node + happy-dom, React Testing Library, Vue Test Utils, and compiled Svelte fixtures. Do not add a second test framework or DOM library.
- `examples/*` consume workspace packages. After package changes, rebuild (`pnpm build` or the matching `build:*`) before relying on a running example.
- For visual or animation bugs, check in an example in a browser, not only in happy-dom.

## Release

- All four packages share one version. Peer ranges: React `^18.0.0 || ^19.0.0`, Vue `^3.5.0`, Svelte `^5.0.0`.
- Preflight: `pnpm install --frozen-lockfile`, `pnpm clean`, `pnpm check`, `pnpm readme:check`, build every example, then `pnpm pack:packages` (tarballs in `artifacts/`, no publish).
- Inspect each tarball: only `dist/**`, `README*.md`, `LICENSE`, and `package.json`; `main`/`module`/`types`/`exports` point into `dist`.
- Publishing is manual and needs explicit authorization: `pnpm npm:publish:check`, then `pnpm npm:publish:<pkg>` or `npm:publish:all`. No CI publishing. Tag `vX.Y.Z` only after preflight.

## Documentation

- READMEs are the only product documentation; follow the [readme-system skill](../readme-system/SKILL.md).
- User-facing integration skills live in `skills/disclosure-<framework>.md`; internal agent guidance stays in `.agents/`. Link the former from READMEs, never the latter.
- Maintain `README.md` (EN), `README_VI.md`, `README_CN.md` together; use absolute GitHub blob links.
- Document implemented behavior only.

## Reuse

To support another source tree, copy this file to `.agents/skills/<source>/SKILL.md`, change `name`/`description` and paths, and add it to `.agents/AGENTS.md`. Keep hard repository rules in `AGENTS.md`; keep this file compact.
