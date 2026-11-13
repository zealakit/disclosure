# @zealakit/disclosure-vanilla

[English](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

面向原生 JavaScript 与静态 HTML 的无头 Collapsible / Accordion。提供状态、无障碍与内置高度动画 — 无需 React、Vue 或 Svelte。样式由你自行控制。

用带 `data-*` 的语义化 HTML 编写结构，然后调用一次 `createDisclosure()`。把 padding / border / background 写在 content 元素的 class 上（初始化时会移到 `[data-collapsible-content-wrapper]`），以便关闭动画干净收起。

> **Note**
>
> Disclosure 不是完整 UI 库的替代品。适合在组件库里的 Accordion/Collapsible 难以定制时使用 — 或者你只需要这一个基础组件。

## 安装

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
# 或：pnpm add / yarn add / bun add
```

无 peer 依赖。可用 bundler（Vite、esbuild …）或通过 import map 指向 ESM 构建。

### CDN（静态 HTML）

生产环境请**固定版本号**，不要使用未版本化的 `latest` CDN URL。

IIFE 全局命名空间： **`ZealakitDisclosure`**。

```html
<!-- ESM CDN -->
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/+esm";
  const disclosure = createDisclosure();
</script>

<!-- Script IIFE -->
<script src="https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1.0.0/dist/index.global.min.js"></script>
<script>
  const disclosure = ZealakitDisclosure.createDisclosure();
</script>
```

`dist/*` 说明见 [README.md](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md#cdn-static-html)。

## 快速开始

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
</script>
```

## 公共 API

| Export | 说明 |
| --- | --- |
| `createDisclosure(root?)` | 初始化 `document` 或指定根节点下的所有 `[data-disclosure]` / `[data-accordion]` |
| `DisclosureController.destroy()` | 移除监听并恢复 content 节点 |
| `DisclosureController.refresh()` | Destroy 后重新扫描（动态插入的标记） |

属性表、Accordion、动画与样式约定见 [README.md](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md)（英文）— 与各框架包行为一致。

## Agent skill

[skills/disclosure-vanilla.md](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vanilla.md)

## License

MIT © Zealakit
