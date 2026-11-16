# @zealakit/disclosure-vanilla

[English](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

面向原生 JavaScript 和静态 HTML 的无样式 Collapsible 与 Accordion。提供状态、无障碍和内置的高度动画 — 无需 React、Vue 或 Svelte。视觉样式由你负责。

用带 `data-*` 属性的语义化 HTML 编写结构，然后调用一次 `createDisclosure()`。把 padding、border 和 background 写在 content 元素的 class 上（初始化时会移到 `[data-collapsible-content-wrapper]`），以便关闭动画干净收起。

> **Note**
> Disclosure 不是完整 UI 库的替代品。适合在组件库里的 Accordion/Collapsible 难以定制时使用 — 或者你只需要这一个基础组件。

## Install

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
# or: pnpm add / yarn add / bun add
```

无 peer 依赖。可配合 bundler（Vite、esbuild …）或指向 ESM 构建的浏览器 import map 使用。

### CDN (static HTML)

生产环境请固定已发布的版本号。**不要**使用未带版本的 `latest` CDN URL。

已发布的产物（仅 ESM）：

| 文件 | 用途 |
| --- | --- |
| `dist/index.js` | ESM（bundler、import map、jsDelivr `/+esm`、esm.sh） |
| `dist/index.d.ts` | TypeScript 声明 |

#### Native ESM CDN

```html
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.1.0/+esm";

  const disclosure = createDisclosure();
</script>
```

也可使用 esm.sh：

```html
<script type="module">
  import { createDisclosure } from "https://esm.sh/@zealakit/disclosure-vanilla@1.1.0";

  const disclosure = createDisclosure();
</script>
```

### Migrating from 1.0

IIFE 构建（`dist/index.global*.js`、`ZealakitDisclosure` 全局变量以及 `unpkg` / `jsdelivr` / `./global*` 入口）已在 1.1.0 移除。请改为导入 ESM 构建：

```html
<!-- 1.0.0 -->
<script src="https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/dist/index.global.min.js"></script>
<script>
  ZealakitDisclosure.createDisclosure();
</script>

<!-- 1.1.0+ -->
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1/+esm";
  createDisclosure();
</script>
```

## Public API

| Export | 说明 |
| --- | --- |
| `createDisclosure(root?)` | 初始化 `document` 或指定根节点下的所有 `[data-disclosure]` / `[data-accordion]` |
| `createDisclosure({ root })` | 同上，选项对象形式 |
| `DisclosureController.destroy()` | 移除监听并恢复 content 节点 |
| `DisclosureController.refresh()` | Destroy 后重新扫描（动态插入的标记） |
| `DEFAULT_ANIMATION_DURATION` / `_DELAY` / `_EASING` | 与各框架包相同的动画默认值 |
| `normalizeAnimationConfig` / `getAnimationStyle` | 共享的动画辅助函数 |

## Markup

### Collapsible markup

| Attribute | 位置 | 说明 |
| --- | --- | --- |
| `data-disclosure` | root | 标记 Collapsible 根节点 |
| `data-disclosure-trigger` | `<button type="button">` | 切换控件 |
| `data-disclosure-content` | content 区域 | 面板内容 |
| `data-default-open` | root | 初始展开（默认 `false`） |
| `data-disabled` | root | 禁用交互 |
| `data-force-mount` | content | 关闭时仍保留 content 在 DOM 中 |
| `data-animation` | root | `"false"` 关闭高度动画；`""` / `"true"` 开启（默认开启） |
| `data-animation-duration` | root | 时长（毫秒，默认 `200`） |
| `data-animation-delay` | root | 延迟（毫秒，默认 `0`） |
| `data-animation-easing` | root | `ease-in-out`、`linear` 或任意 CSS timing function（默认 `ease-in-out`） |

初始化后的 root 属性：`data-slot="collapsible"`、`data-state="open" \| "closed"`，禁用时带 `data-disabled`。Trigger 会获得 `aria-expanded` / `aria-controls`。

### Accordion markup

```html
<div data-accordion data-accordion-type="single" data-collapsible>
  <section data-accordion-item data-value="item-1">
    <h3>
      <button type="button" data-accordion-trigger>
        First item
      </button>
    </h3>
    <div id="accordion-content-1" data-accordion-content hidden>
      First content
    </div>
  </section>
</div>
```

| Attribute | 位置 | 说明 |
| --- | --- | --- |
| `data-accordion` | root | 标记 Accordion 根节点 |
| `data-accordion-type` | root | `single`（默认）\| `multiple` |
| `data-collapsible` | root | 允许在 single 模式下关闭已展开的项 |
| `data-default-value` | root | 初始值；`multiple` 时用空格/逗号分隔 |
| `data-disabled` | root 或 item | 禁用根节点或单个项 |
| `data-accordion-item` + `data-value` | item | 稳定的项 ID |
| `data-accordion-trigger` | `<button>` | 项的触发器（建议放在 `h2`–`h6` 内） |
| `data-accordion-content` | panel | 项的内容区域 |
| Animation attrs | root | 与 Collapsible 相同 |

键盘（已启用的 trigger）：`ArrowDown` / `ArrowUp` / `Home` / `End`。嵌套的 accordion 相互独立。

### Animation

高度动画使用 CSS `grid-template-rows`（`minmax(0, 0fr)` ↔ `minmax(0, 1fr)`），默认开启（Overlay：默认关闭；默认时长 200ms 对 160ms；没有 `type` / `direction`）。`prefers-reduced-motion: reduce` 会禁用动效。关闭过渡期间 content 保持挂载，之后会被移除，除非设置了 `data-force-mount`。

content viewport 上的 CSS 变量：

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

## Usage

### Quick start

```html
<div data-disclosure>
  <button type="button" data-disclosure-trigger aria-expanded="false">
    Toggle content
  </button>
  <div id="content-1" data-disclosure-content hidden>
    Content
  </div>
</div>

<script type="module">
  import { createDisclosure } from "@zealakit/disclosure-vanilla";
  const disclosure = createDisclosure();
  // disclosure.refresh() after inserting new markup
  // disclosure.destroy() when tearing down
</script>
```

## Lifecycle

```ts
const disclosure = createDisclosure(document.getElementById("app"));

// After dynamically inserting markup:
disclosure.refresh();

// On page teardown / SPA unmount:
disclosure.destroy();
```

在同一批 root 上调用两次 `createDisclosure()` 不会重复注册监听。标记变化时请使用 `refresh()` 或 `destroy()` + `createDisclosure()`。

## Styling hooks

无样式 — 没有主题或图标。用你自己的 CSS 配合：

- `data-slot` — `collapsible`, `collapsible-trigger`, `collapsible-content`, `accordion`, `accordion-item`, `accordion-heading`, `accordion-trigger`, `accordion-content`
- `data-state` — `open` \| `closed`
- `data-disabled`

把外观样式放在 content 元素的 class/style 上（会应用到 `[data-collapsible-content-wrapper]`）。

## Agent Skill

面向 agent 的实用说明：[skills/disclosure-vanilla.md](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vanilla.md)

## License

MIT © Zealakit
