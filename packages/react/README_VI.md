# @zealakit/disclosure-react

[English](https://github.com/zealakit/disclosure/blob/main/packages/react/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/react/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/react/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho React. Cung cấp state, composition, accessibility và animation chiều cao tích hợp sẵn. Phần giao diện do bạn tự quyết định.

Áp dụng padding, border và background thông qua `className` trên `CollapsibleContent` / `AccordionContent` (hoặc `[data-collapsible-content-wrapper]`). Các style này nằm trên panel nội dung bị cắt (clip), nhờ đó animation đóng sẽ thu gọn mượt mà.

> **Note**
> Disclosure không thay thế một UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi bạn chỉ cần một primitive đó và không muốn kéo cả design system lớn.

## Install

```bash
npm i @zealakit/disclosure-react
# or: pnpm add / yarn add / bun add
```

Peer dependencies: `react`, `react-dom` (`^18.0.0 || ^19.0.0`).

## Collapsible

### Quick start

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
| `defaultOpen` | `boolean` | `false` | Trạng thái mở ban đầu khi dùng uncontrolled |
| `open` | `boolean` | — | Trạng thái mở (controlled) |
| `onOpenChange` | `(open: boolean) => void` | — | Được gọi khi trạng thái mở cần thay đổi |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ collapsible |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation mở/đóng theo chiều cao. `false` để tắt; truyền object để tùy chỉnh |
| `children` | `ReactNode` | — | Các phần thành phần (`Trigger`, `Content`, …) |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | Được chuyển tiếp tới phần tử root |

Thuộc tính trên root: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` khi bị vô hiệu hóa.

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Vô hiệu hóa trigger này |
| `children` | `ReactNode` | — | Nhãn / nội dung của trigger |
| `...button props` | `ButtonHTMLAttributes` | — | Được chuyển tiếp tới `<button>` gốc |

Thiết lập `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"` và `data-state`.

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung trong DOM khi đang đóng |
| `children` | `ReactNode` | — | Phần thân của panel |
| `className` / `style` | — | — | Áp dụng cho wrapper nội dung **bên trong** (bị clip khi animation) |
| `...div props` | `HTMLAttributes<HTMLDivElement>` | — | Được chuyển tiếp tới wrapper bên trong |

Viewport có animation quản lý chiều cao và việc clip. Hãy đặt border/padding vào `className` / wrapper, đừng chỉ dùng `[data-slot="collapsible-content"]` để áp lên viewport.

### Controlled usage

```tsx
const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Animation configuration

```tsx
<Collapsible
  animation={{ duration: 300, delay: 50, easing: "linear" }}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```tsx
<Collapsible animation={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` khi có config | Đặt `false` để tắt animation. |
| `duration` | `number` | `200` | Mili giây. |
| `delay` | `number` | `0` | Mili giây. |
| `easing` | `string` | `"ease-in-out"` | `ease-in-out`, `linear`, hoặc bất kỳ CSS timing function nào. |
| `...` | — | — | Truyền `true` để dùng mặc định, `false` để tắt. |

Animation **bật mặc định** (Overlay: tắt), duration mặc định 200ms (Overlay: 160ms), và không có `type` / `direction`: Disclosure chỉ có một chuyển động chiều cao dựng sẵn.

Khi tắt animation, việc mở/đóng được cập nhật ngay lập tức và duration/delay bị bỏ qua. `prefers-reduced-motion: reduce` cũng sẽ tắt chuyển động.

Các CSS variable được đặt trên content viewport:

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

### Quick start

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

### `Accordion` props (shared)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Chế độ chọn |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation chiều cao cho các panel của item (dùng chung cho mọi item). `false` để tắt; truyền object để tùy chỉnh |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ accordion |
| `children` | `ReactNode` | — | Các `AccordionItem` con |
| `...div props` | — | — | Được chuyển tiếp tới phần tử root |

Các prop animation do root Accordion quản lý và được mọi item kế thừa. Không có override animation theo từng item.

### `Accordion` props (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Item đang mở (controlled) |
| `defaultValue` | `string \| null` | `null` | Item ban đầu (uncontrolled) |
| `collapsible` | `boolean` | `false` | Cho phép đóng item đang mở |
| `onValueChange` | `(value: string \| null) => void` | — | Callback khi giá trị thay đổi |

### `Accordion` props (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Các item đang mở (controlled) |
| `defaultValue` | `string[]` | `[]` | Các item ban đầu (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | Callback khi giá trị thay đổi |

`collapsible` không áp dụng ở chế độ multiple.

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | ID ổn định của item |
| `disabled` | `boolean` | `false` | Vô hiệu hóa item này |
| `children` | `ReactNode` | — | Trigger + content |
| `...div props` | — | — | Được chuyển tiếp tới root của item |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Vô hiệu hóa trigger này |
| `children` | `ReactNode` | — | Nhãn của trigger |
| `...button props` | — | — | Được chuyển tiếp tới `<button>` gốc |

Bàn phím: Arrow Up/Down, Home, End.

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung được mount khi đang đóng |
| `children` | `ReactNode` | — | Phần thân của panel |
| `className` / `style` | — | — | Áp dụng cho wrapper bên trong bị clip |
| `...section props` | — | — | Được chuyển tiếp tới wrapper bên trong |

### Multiple mode example

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

### Animation configuration

```tsx
<Accordion
  type="single"
  collapsible
  animation={{ duration: 300, easing: "ease-in-out", delay: 0 }}
>
  ...
</Accordion>
```

## Next.js App Router

Package này **không** gắn sẵn `"use client"`. Khi dùng trong Next.js App Router, thêm `"use client"` vào đầu file component của bạn — ví dụ:

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

## Styling hooks

| Attribute | Where | Purpose |
| --- | --- | --- |
| `data-slot` | root / trigger / content | Chọn các phần tử trong CSS |
| `data-state` | `"open" \| "closed"` | Style cho trạng thái mở/đóng |
| `data-disabled` | khi bị vô hiệu hóa | Style cho trạng thái vô hiệu hóa |
| `data-collapsible-content-wrapper` | panel bên trong | Border, padding, background |
| `data-animated` | content viewport | Có mặt khi animation chiều cao đang hoạt động |

## Agent Skill

Hướng dẫn React thực chiến cho AI coding agent: [disclosure-react skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-react.md).

## License

MIT © Zealakit
