# @zealakit/disclosure-vue

[English](https://github.com/zealakit/disclosure/blob/main/packages/vue/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho Vue 3. Animation chiều cao tích hợp sẵn và được bật theo mặc định. Phần giao diện do bạn tự quyết định.

Áp dụng padding, border và background thông qua `class` trên `CollapsibleContent` / `AccordionContent` (hoặc `[data-collapsible-content-wrapper]`). Các style này nằm trên panel nội dung bị cắt (clip), nhờ đó animation đóng sẽ thu gọn mượt mà.

> **Note**
>
> Disclosure không thay thế một UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi bạn chỉ cần một primitive đó và không muốn kéo cả design system lớn.

## Cài đặt

```bash
npm i @zealakit/disclosure-vue
# or: pnpm add / yarn add / bun add
```

Peer dependency: `vue` (^3.5).

## Collapsible

### Bắt đầu nhanh

```vue
<script setup lang="ts">
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-vue";
</script>

<template>
  <Collapsible>
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

### Props của `Collapsible`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Trạng thái mở ban đầu khi dùng uncontrolled |
| `open` | `boolean` | — | Trạng thái mở (controlled) (`v-model:open`) |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ collapsible |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation mở/đóng theo chiều cao. `false` để tắt; truyền object để tùy chỉnh |

### Events của `Collapsible`

| Event | Payload | Description |
| --- | --- | --- |
| `update:open` | `boolean` | Cập nhật `v-model:open` |
| `openChange` | `boolean` | Callback khi trạng thái mở thay đổi |

Thuộc tính trên root: `data-slot="collapsible"`, `data-state="open" | "closed"`, `data-disabled` khi bị vô hiệu hóa.

### Props của `CollapsibleTrigger`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits root | Vô hiệu hóa trigger này |

Thiết lập `aria-expanded`, `aria-controls`, `data-slot="collapsible-trigger"` và `data-state`. Các attribute bổ sung sẽ được chuyển xuống `<button>` gốc.

### Props của `CollapsibleContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung trong DOM khi đang đóng |

`class` / `style` và các attr khác được áp dụng cho wrapper nội dung **bên trong** (bị clip khi animation). Nên đặt border/padding ở đó.

### Sử dụng controlled

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/disclosure-vue";

const open = ref(false);
</script>

<template>
  <Collapsible v-model:open="open">
    <CollapsibleTrigger>Toggle</CollapsibleTrigger>
    <CollapsibleContent>Content</CollapsibleContent>
  </Collapsible>
</template>
```

### Cấu hình animation

```vue
<Collapsible
  :animation="{ duration: 300, delay: 50, easing: 'linear' }"
>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

```vue
<Collapsible :animation="false">
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

Animation **bật mặc định** (Overlay: tắt), duration mặc định 200ms (Overlay: 160ms), và không có `type` / `direction`: Disclosure chỉ có một chuyển động chiều cao dựng sẵn. Khi truyền cả hai, `animation` được ưu tiên và các prop deprecated bị bỏ qua.

Khi tắt animation, việc mở/đóng được cập nhật ngay lập tức và duration/delay bị bỏ qua. `prefers-reduced-motion: reduce` cũng sẽ tắt chuyển động.

| Đã deprecated (vẫn hoạt động đến 2.0.0, cảnh báo một lần ở môi trường dev) | Thay bằng |
| --- | --- |
| `:animated="false"` | `:animation="false"` |
| `:animation-duration="320"` | `:animation="{ duration: 320 }"` |
| `:animation-delay="120"` | `:animation="{ delay: 120 }"` |
| `animation-timing-function="linear"` | `:animation="{ easing: 'linear' }"` |

Các CSS variable trên content viewport:

- `--collapsible-animation-duration`
- `--collapsible-animation-easing`
- `--collapsible-animation-delay`

### `forceMount`

```vue
<CollapsibleContent force-mount>
  Stays mounted while closed (`inert`; `hidden` when not animated).
</CollapsibleContent>
```

## Accordion

### Bắt đầu nhanh

```vue
<script setup lang="ts">
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/disclosure-vue";
</script>

<template>
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
</template>
```

### Props của `Accordion` (dùng chung)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `"single" \| "multiple"` | `"single"` | Chế độ chọn |
| `animation` | `boolean \| AnimationConfig` | `true` | Animation chiều cao cho các panel của item (dùng chung cho mọi item). `false` để tắt; truyền object để tùy chỉnh |
| `disabled` | `boolean` | `false` | Vô hiệu hóa toàn bộ accordion |

Các prop animation do root Accordion quản lý và được mọi item kế thừa.

### Props của `Accordion` (`type="single"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string \| null` | — | Item đang mở (controlled) (`v-model:value`) |
| `defaultValue` | `string \| null` | `null` | Item ban đầu (uncontrolled) |
| `collapsible` | `boolean` | `false` | Cho phép đóng item đang mở |

### Props của `Accordion` (`type="multiple"`)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string[]` | — | Các item đang mở (controlled) (`v-model:value`) |
| `defaultValue` | `string[]` | `[]` | Các item ban đầu (uncontrolled) |

`collapsible` không áp dụng ở chế độ multiple.

### Events của `Accordion`

| Event | Payload | Description |
| --- | --- | --- |
| `update:value` | `string \| null \| string[]` | Cập nhật `v-model:value` |
| `valueChange` | `string \| null \| string[]` | Callback khi giá trị thay đổi |

### Props của `AccordionItem`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | **required** | ID ổn định của item |
| `disabled` | `boolean` | `false` | Vô hiệu hóa item này |

### Props của `AccordionTrigger`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | inherits | Vô hiệu hóa trigger này |

Bàn phím: Arrow Up/Down, Home, End.

### Props của `AccordionContent`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `forceMount` | `boolean` | `false` | Giữ nội dung được mount khi đang đóng |

`class` / `style` được áp dụng cho wrapper bên trong bị clip.

### Ví dụ chế độ multiple

```vue
<Accordion type="multiple" :default-value="['general']">
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

```vue
<Accordion
  type="single"
  collapsible
  :animation="{ duration: 300, easing: 'ease-in-out', delay: 0 }"
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

Hướng dẫn Vue thực chiến cho AI coding agent: [disclosure-vue skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vue.md).

## Giấy phép

MIT © Zealakit
