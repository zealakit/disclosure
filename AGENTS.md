# Agent instructions (Disclosure)

This repo is a **pnpm monorepo** of headless disclosure primitives (`Collapsible`, `Accordion`) for React, Vue, and Svelte. There is **no shared runtime package** — each framework package is independent.

## Always follow

- **Architecture:** [.agents/skills/disclosure/SKILL.md](.agents/skills/disclosure/SKILL.md) — layout, package boundaries, animation/a11y conventions
- **Rules:** [.agents/rules/](.agents/rules/)

## Quick map

| Area | Path |
| --- | --- |
| React package | `packages/react/` (`@zealakit/disclosure-react`) |
| Vue package | `packages/vue/` (`@zealakit/disclosure-vue`) |
| Svelte package | `packages/svelte/` (`@zealakit/disclosure-svelte`) |
| Examples | `examples/{react,vue,svelte,nextjs}/` |
| Cover / assets | `assets/images/` |
| Docs | Root + per-package `README.md`, `README_VI.md`, `README_CN.md` |
| Dependency UI | `monitor/` (`pnpm monitor`) |

## Commands

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint

pnpm dev:react
pnpm dev:vue
pnpm dev:svelte
pnpm dev:nextjs

pnpm publish:check
pnpm publish:react   # or publish:vue / publish:svelte / publish:all

pnpm monitor         # local dependency UI at http://127.0.0.1:4177
```

## Docs

- Keep EN / VI / CN READMEs in sync when changing API or usage.
- Language switchers and cover images use GitHub blob URLs under `https://github.com/zealakit/disclosure/blob/main/...`.
