# @zealakit/disclosure-react

[English](https://github.com/zealakit/disclosure/blob/main/packages/react/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/react/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/react/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

适用于 React 的无样式（headless）Collapsible 和 Accordion。提供状态管理、组合式 API、无障碍支持以及内置的高度动画。视觉样式完全由你掌控。

通过 `CollapsibleContent` / `AccordionContent` 上的 `className`（或 `[data-collapsible-content-wrapper]`）来设置内边距、边框和背景。这些样式会作用在被裁剪的内容面板上，从而让收起动画平滑收拢。

> **Note**
>
> Disclosure 不是完整 UI 库的替代品。适合在组件库里的 Accordion/Collapsible 难以定制时使用 — 或者你只需要这一个基础组件，而不想引入整套大型设计系统。

## 安装

```bash
npm i @zealakit/disclosure-react
# or: pnpm add / yarn add / bun add
```

Peer dependencies：`react`、`react-dom`（≥ 18）。

## Collapsible

### 快速开始

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-react";

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

### `Collapsible` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | 非受控模式下的初始展开状态 |
| `open` | `boolean` | — | 受控的展开状态 |
| `onOpenChange` | `(open: boolean) => void` | — | 展开状态需要变更时调用 |
| `disabled` | `boolean` | `false` | 禁用整个 collapsible |
| `animated` | `boolean` | `true` | 启用高度展开/收起动画 |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | 过渡缓动函数 |
| `animationDuration` | `number` | `200` | 持续时间（毫秒） |
| `animationDelay` | `number` | `0` | 延迟时间（毫秒） |
| `children` | `ReactNode` | — | 组合子部件（`Trigger`、`Content` 等） |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | 透传给根元素 |

根元素属性：`data-slot="collapsible"`、`data-state="open" | "closed"`，禁用时带有 `data-disabled`。

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | 禁用此触发器 |
| `children` | `ReactNode` | — | 触发器的标签 / 内容 |
| `...button props` | `ButtonHTMLAttributes` | — | 透传给原生 `<button>` |

会设置 `aria-expanded`、`aria-controls`、`data-slot="collapsible-trigger"` 和 `data-state`。

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | 收起时仍将内容保留在 DOM 中 |
| `children` | `ReactNode` | — | 面板主体 |
| `className` / `style` | — | — | 应用于**内部**内容包装层（动画期间会被裁剪） |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | 透传给内部包装层 |

带动画的 viewport 负责高度与裁剪。请把边框/内边距放在 `className` / 包装层上，不要仅通过 `[data-slot="collapsible-content"]` 作用于 viewport。

### 受控用法

```tsx
const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### 动画配置

```tsx
<Collapsible
  animationTimingFunction="linear"
  animationDuration={300}
  animationDelay={50}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```tsx
<Collapsible animated={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

当 `animated={false}` 时，展开/收起会立即更新，duration/delay 将被忽略。`prefers-reduced-motion: reduce` 同样会禁用动画。

设置在内容 viewport 上的 CSS 变量：

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```tsx
<CollapsibleContent forceMount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### 快速开始

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/disclosure-react";

<Accordion type="single" collapsible>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
```

### `Accordion` props（通用）

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | 选择模式 |
| `animated` | `boolean` | `true` | 项目面板的高度动画 |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | 所有项目的缓动函数 |
| `animationDuration` | `number` | `200` | 持续时间（毫秒） |
| `animationDelay` | `number` | `0` | 延迟时间（毫秒） |
| `disabled` | `boolean` | `false` | 禁用整个 accordion |
| `children` | `ReactNode` | — | `AccordionItem` 子元素 |
| `...div props` | — | — | 透传给根元素 |

动画相关 props 由 Accordion 根组件持有，并被所有项目继承。不支持为单个项目单独覆盖动画设置。

### `Accordion` props（`type="single"`）

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | 受控的展开项 |
| `defaultValue` | `string \| null` | `null` | 非受控的初始项 |
| `collapsible` | `boolean` | `false` | 允许关闭已展开的项目 |
| `onValueChange` | `(value: string \| null) => void` | — | 值变更回调 |

### `Accordion` props（`type="multiple"`）

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | 受控的展开项列表 |
| `defaultValue` | `string[]` | `[]` | 非受控的初始项列表 |
| `onValueChange` | `(value: string[]) => void` | — | 值变更回调 |

`collapsible` 不适用于 multiple 模式。

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | 稳定的项目 ID |
| `disabled` | `boolean` | `false` | 禁用此项目 |
| `children` | `ReactNode` | — | Trigger + content |
| `...div props` | — | — | 透传给项目根元素 |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | 禁用此触发器 |
| `children` | `ReactNode` | — | 触发器标签 |
| `...button props` | — | — | 透传给原生 `<button>` |

键盘操作：Arrow Up/Down、Home、End。

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | 收起时仍保持内容挂载 |
| `children` | `ReactNode` | — | 面板主体 |
| `className` / `style` | — | — | 应用于内部被裁剪的包装层 |
| `...section props` | — | — | 透传给内部包装层 |

### Multiple 模式示例

```tsx
<Accordion type="multiple" defaultValue={["general"]}>
  <AccordionItem value="general">
    <AccordionTrigger>General</AccordionTrigger>
    <AccordionContent>General content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="advanced">
    <AccordionTrigger>Advanced</AccordionTrigger>
    <AccordionContent>Advanced content</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 自定义动画的 Accordion

```tsx
<Accordion
  type="single"
  collapsible
  animationTimingFunction="ease-in-out"
  animationDuration={300}
  animationDelay={0}
>
  ...
</Accordion>
```

## 样式钩子

| Attribute | Where | Purpose |
| --- | --- | --- |
| `data-slot` | root / trigger / content | 在 CSS 中定位各个部分 |
| `data-state` | `"open" \| "closed"` | 展开/收起状态的样式 |
| `data-disabled` | 禁用时 | 禁用状态的样式 |
| `data-collapsible-content-wrapper` | 内部面板 | 边框、内边距、背景 |
| `data-animated` | 内容 viewport | 高度动画生效时存在 |

## Next.js App Router

此包**没有**内置 `"use client"`。在 Next.js App Router 中使用时，请在你的组件文件顶部添加 `"use client"` — 例如：

```tsx
// app/components/faq.tsx
"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-react";

export function Faq() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

## AI Agent Skill

面向 AI coding agent 的 React 实战说明：[disclosure-react skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-react.md)。

## 许可证

MIT © Zealakit
