# Disclosure

[English](https://github.com/zealakit/disclosure/blob/main/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

面向现代 UI 框架的无头 Disclosure 基础组件。

**Disclosure** 目前提供两个独立基础组件：

- **Collapsible** — 单个开合面板
- **Accordion** — 支持单选/多选的分组面板

只提供交互行为与无障碍能力 — 不含颜色、图标或布局。默认内置高度动画。通过 `data-slot` 和 `data-state` 自行编写样式。

> **Note**
>
> Disclosure 不是完整 UI 库的替代品。适合在组件库里的 Accordion/Collapsible 难以定制时使用 — 或者你只需要这一个基础组件，而不想引入整套大型设计系统。

## Packages

| Package | Framework | 文档 |
| --- | --- | --- |
| `@zealakit/disclosure-react` | React 18+ | [packages/react/README_CN.md](https://github.com/zealakit/disclosure/blob/main/packages/react/README_CN.md) |
| `@zealakit/disclosure-vue` | Vue 3.5+ | [packages/vue/README_CN.md](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_CN.md) |
| `@zealakit/disclosure-svelte` | Svelte 5 | [packages/svelte/README_CN.md](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_CN.md) |

每个 package 可独立安装。没有共享 runtime package。

完整 API、props 与使用指南见上方 package 文档。

## 安装

使用你喜欢的包管理器（`npm`、`pnpm`、`yarn`、`bun` …）：

```bash
npm i @zealakit/disclosure-react
npm i @zealakit/disclosure-vue
npm i @zealakit/disclosure-svelte
```

## Examples

```bash
pnpm install
pnpm build

pnpm dev:react
pnpm dev:vue
pnpm dev:svelte
pnpm dev:nextjs
```

## Dependency monitoring

本地 UI，用于查看 root 与 `packages/*` 的依赖版本（排除 `examples/`）：

```bash
pnpm monitor
```

打开 http://127.0.0.1:4177 — 详见 [monitor/README.md](https://github.com/zealakit/disclosure/blob/main/monitor/README.md)。

## AI Agent Skills

面向 AI coding agent 的分框架使用说明：

- [Disclosure React Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-react.md)
- [Disclosure Vue Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vue.md)
- [Disclosure Svelte Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-svelte.md)

## License

MIT © Zealakit
