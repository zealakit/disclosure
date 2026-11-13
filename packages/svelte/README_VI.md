# @zealakit/disclosure-svelte

[English](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho Svelte 5. Animation chiều cao tích hợp sẵn và được bật theo mặc định. Phần giao diện do bạn tự quyết định.

Áp dụng padding, border và background thông qua `class` trên `CollapsibleContent` / `AccordionContent` (hoặc `[data-collapsible-content-wrapper]`). Các style này nằm trên panel nội dung bị cắt (clip), nhờ đó animation đóng sẽ thu gọn mượt mà.

> **Note**
>
> Disclosure không thay thế một UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi bạn chỉ cần một primitive đó và không muốn kéo cả design system lớn.

## Cài đặt

```bash
npm i @zealakit/disclosure-svelte
# or: pnpm add / yarn add / bun add
```

Peer dependency: `svelte` (^5).

## Collapsible

### Bắt đầu nhanh

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

### Props của `Collapsible`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Trạng thái mở ban đầu khi dùng uncontrolled |
| `open` | `boolean` | — | Trạng thái mở (controlled) (`bind:open`) |
| `onOpenChange` | `(open: boolean) => void` | — | Được gọi khi trạng thái mở cần thay đổi |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ collapsible |
| `animated` | `boolean` | `true` | Bật animation mở/đóng theo chiều cao |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Hàm easing của transition |
| `animationDuration` | `number` | `200` | Thời lượng tính bằng mili giây |
| `animationDelay` | `number` | `0` | Độ trễ tính bằng mili giây |
| `class` / other attrs | — | — | Được chuyển tiếp tới phần tử root |

Thuộc tính trên root: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` khi bị vô hiệu hóa.

### Props của `CollapsibleTrigger`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Vô hiệu hóa trigger này |
| `class` / other attrs | — | — | Được chuyển tiếp tới `<button>` gốc |

Thiết lập `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"` và `data-state`.

### Props của `CollapsibleContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung trong DOM khi đang đóng |
| `class` / `style` | — | — | Áp dụng cho wrapper nội dung **bên trong** (bị clip khi animation) |
| other attrs | — | — | Được chuyển tiếp tới wrapper bên trong |

Hãy đặt border/padding trên wrapper nội dung, đừng chỉ đặt trên viewport có animation.

### Sử dụng controlled

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

### Cấu hình animation

```svelte
<Collapsible
  animationTimingFunction="linear"
  animationDuration={300}
  animationDelay={50}
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```svelte
<Collapsible animated={false}>
  <CollapsibleTrigger>Instant</CollapsibleTrigger>
  <CollapsibleContent>No height transition</CollapsibleContent>
</Collapsible>
```

Khi `animated={false}`, việc mở/đóng được cập nhật ngay lập tức và duration/delay bị bỏ qua. `prefers-reduced-motion` cũng sẽ tắt chuyển động.

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

### Bắt đầu nhanh

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

### Props của `Accordion` (dùng chung)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Chế độ chọn |
| `animated` | `boolean` | `true` | Animation chiều cao cho các panel của item |
| `animationTimingFunction` | `"linear" \| "ease-in-out"` | `"ease-in-out"` | Easing cho tất cả item |
| `animationDuration` | `number` | `200` | Thời lượng tính bằng mili giây |
| `animationDelay` | `number` | `0` | Độ trễ tính bằng mili giây |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ accordion |
| `class` / other attrs | — | — | Được chuyển tiếp tới phần tử root |

Các prop animation do root Accordion quản lý và được mọi item kế thừa.

### Props của `Accordion` (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Item đang mở (controlled) (`bind:value`) |
| `defaultValue` | `string \| null` | `null` | Item ban đầu (uncontrolled) |
| `collapsible` | `boolean` | `false` | Cho phép đóng item đang mở |
| `onValueChange` | `(value: string \| null) => void` | — | Callback khi giá trị thay đổi |

### Props của `Accordion` (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Các item đang mở (controlled) (`bind:value`) |
| `defaultValue` | `string[]` | `[]` | Các item ban đầu (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | Callback khi giá trị thay đổi |

`collapsible` không áp dụng ở chế độ multiple.

### Props của `AccordionItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | ID ổn định của item |
| `disabled` | `boolean` | `false` | Vô hiệu hóa item này |
| `class` / other attrs | — | — | Được chuyển tiếp tới root của item |

### Props của `AccordionTrigger`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Vô hiệu hóa trigger này |
| `class` / other attrs | — | — | Được chuyển tiếp tới `<button>` gốc |

Bàn phím: Arrow Up/Down, Home, End.

### Props của `AccordionContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung được mount khi đang đóng |
| `class` / `style` | — | — | Áp dụng cho wrapper bên trong bị clip |
| other attrs | — | — | Được chuyển tiếp tới wrapper bên trong |

### Ví dụ chế độ multiple

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

### Accordion với animation tùy chỉnh

```svelte
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

## Styling hooks

| Attribute | Where | Purpose |
| --- | --- | --- |
| `data-slot` | root / trigger / content | Chọn các phần tử trong CSS |
| `data-state` | `"open" \| "closed"` | Style cho trạng thái mở/đóng |
| `data-disabled` | khi bị vô hiệu hóa | Style cho trạng thái vô hiệu hóa |
| `data-collapsible-content-wrapper` | panel bên trong | Border, padding, background |
| `data-animated` | content viewport | Có mặt khi animation chiều cao đang hoạt động |

## AI Agent Skill

Hướng dẫn Svelte thực chiến cho AI coding agent: [disclosure-svelte skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-svelte.md).

## Giấy phép

MIT © Zealakit
