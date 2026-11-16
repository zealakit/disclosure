# @zealakit/disclosure-svelte

[English](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho Svelte 5. Animation chiều cao tích hợp sẵn và được bật theo mặc định. Phần giao diện do bạn tự quyết định.

Áp dụng padding, border và background thông qua `class` trên `CollapsibleContent` / `AccordionContent` (hoặc `[data-collapsible-content-wrapper]`). Các style này nằm trên panel nội dung bị cắt (clip), nhờ đó animation đóng sẽ thu gọn mượt mà.

> **Note**
> Disclosure không thay thế một UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi bạn chỉ cần một primitive đó và không muốn kéo cả design system lớn.

## Install

```bash
npm i @zealakit/disclosure-svelte
# or: pnpm add / yarn add / bun add
```

Peer dependency: `svelte` (^5).

## Collapsible

### Quick start

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/disclosure-svelte";
</script>

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### `Collapsible` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Trạng thái mở ban đầu khi dùng uncontrolled |
| `open` | `boolean` | — | Trạng thái mở (controlled) (`bind:open`) |
| `onOpenChange` | `(open: boolean) => void` | — | Được gọi khi trạng thái mở cần thay đổi |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ collapsible |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation mở/đóng theo chiều cao. `false` để tắt; truyền object để tùy chỉnh |
| `class` / other attrs | — | — | Được chuyển tiếp tới phần tử root |

Thuộc tính trên root: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` khi bị vô hiệu hóa.

### `CollapsibleTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Vô hiệu hóa trigger này |
| `class` / other attrs | — | — | Được chuyển tiếp tới `<button>` gốc |

Thiết lập `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"` và `data-state`.

### `CollapsibleContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung trong DOM khi đang đóng |
| `class` / `style` | — | — | Áp dụng cho wrapper nội dung **bên trong** (bị clip khi animation) |
| other attrs | — | — | Được chuyển tiếp tới wrapper bên trong |

Hãy đặt border/padding trên wrapper nội dung, đừng chỉ đặt trên viewport có animation.

### Controlled usage

```svelte
<script lang="ts">
  import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
  } from "@zealakit/disclosure-svelte";

  let open = $state(false);
</script>

<Collapsible bind:open>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Animation configuration

```svelte
<Collapsible
  animation={{ duration: 300, delay: 50, easing: "linear" }}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```svelte
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

Các CSS variable trên content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```svelte
<CollapsibleContent forceMount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### Quick start

```svelte
<script lang="ts">
  import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from "@zealakit/disclosure-svelte";
</script>

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
| `class` / other attrs | — | — | Được chuyển tiếp tới phần tử root |

Các prop animation do root Accordion quản lý và được mọi item kế thừa.

### `Accordion` props (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Item đang mở (controlled) (`bind:value`) |
| `defaultValue` | `string \| null` | `null` | Item ban đầu (uncontrolled) |
| `collapsible` | `boolean` | `false` | Cho phép đóng item đang mở |
| `onValueChange` | `(value: string \| null) => void` | — | Callback khi giá trị thay đổi |

### `Accordion` props (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Các item đang mở (controlled) (`bind:value`) |
| `defaultValue` | `string[]` | `[]` | Các item ban đầu (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | Callback khi giá trị thay đổi |

`collapsible` không áp dụng ở chế độ multiple.

### `AccordionItem` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | ID ổn định của item |
| `disabled` | `boolean` | `false` | Vô hiệu hóa item này |
| `class` / other attrs | — | — | Được chuyển tiếp tới root của item |

### `AccordionTrigger` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Vô hiệu hóa trigger này |
| `class` / other attrs | — | — | Được chuyển tiếp tới `<button>` gốc |

Bàn phím: Arrow Up/Down, Home, End.

### `AccordionContent` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung được mount khi đang đóng |
| `class` / `style` | — | — | Áp dụng cho wrapper bên trong bị clip |
| other attrs | — | — | Được chuyển tiếp tới wrapper bên trong |

### Multiple mode example

```svelte
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

```svelte
<Accordion
  type="single"
  collapsible
  animation={{ duration: 300, easing: "ease-in-out", delay: 0 }}
>
  ...
</Accordion>
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

Hướng dẫn Svelte thực chiến cho AI coding agent: [disclosure-svelte skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-svelte.md).

## License

MIT © Zealakit
