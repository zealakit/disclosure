# @zealakit/disclosure-vanilla

[English](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho vanilla JavaScript và HTML tĩnh. Cung cấp state, accessibility và animation chiều cao tích hợp — không cần React, Vue hay Svelte. Bạn tự style.

Viết HTML ngữ nghĩa với thuộc tính `data-*`, rồi gọi `createDisclosure()` một lần. Đặt padding, border và background trên class của phần tử content (được chuyển sang `[data-collapsible-content-wrapper]` lúc init) để animation đóng gọn sạch.

> **Note**
> Disclosure không thay thế UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi chỉ cần một primitive và không muốn kéo cả design system.

## Install

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
# or: pnpm add / yarn add / bun add
```

Không có peer dependency. Dùng với bundler (Vite, esbuild, …) hoặc import map trỏ tới bản ESM.

### CDN (static HTML)

Luôn pin version đã publish trên production. **Không** dùng URL CDN `latest` không version.

Artifact được publish (chỉ ESM):

| File | Công dụng |
| --- | --- |
| `dist/index.js` | ESM (bundler, import map, jsDelivr `/+esm`, esm.sh) |
| `dist/index.d.ts` | Khai báo TypeScript |

#### Native ESM CDN

```html
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@2.0.0/+esm";

  const disclosure = createDisclosure();
</script>
```

Cũng dùng được với esm.sh:

```html
<script type="module">
  import { createDisclosure } from "https://esm.sh/@zealakit/disclosure-vanilla@2.0.0";

  const disclosure = createDisclosure();
</script>
```

### Migrating from 1.x

Build IIFE (`dist/index.global*.js`, global `ZealakitDisclosure` và các entry `unpkg` / `jsdelivr` / `./global*`) đã bị gỡ ở 2.0.0. Hãy import bản ESM:

```html
<!-- 1.x -->
<script src="https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@1/dist/index.global.min.js"></script>
<script>
  ZealakitDisclosure.createDisclosure();
</script>

<!-- 2.x -->
<script type="module">
  import { createDisclosure } from "https://cdn.jsdelivr.net/npm/@zealakit/disclosure-vanilla@2/+esm";
  createDisclosure();
</script>
```

## Public API

| Export | Mô tả |
| --- | --- |
| `createDisclosure(root?)` | Khởi tạo mọi `[data-disclosure]` / `[data-accordion]` trong `document` hoặc một root |
| `createDisclosure({ root })` | Tương tự, dạng options object |
| `DisclosureController.destroy()` | Gỡ listener và khôi phục các node content |
| `DisclosureController.refresh()` | Destroy + quét lại (markup chèn động) |
| `DEFAULT_ANIMATION_DURATION` / `_DELAY` / `_EASING` | Giá trị mặc định animation giống các package framework |
| `normalizeAnimationConfig` / `getAnimationStyle` | Helper animation dùng chung |

## Markup

### Collapsible markup

| Attribute | Trên | Mô tả |
| --- | --- | --- |
| `data-disclosure` | root | Đánh dấu root của Collapsible |
| `data-disclosure-trigger` | `<button type="button">` | Nút bật/tắt |
| `data-disclosure-content` | vùng content | Nội dung panel |
| `data-default-open` | root | Mở sẵn lúc đầu (mặc định `false`) |
| `data-disabled` | root | Vô hiệu hóa tương tác |
| `data-force-mount` | content | Giữ content trong DOM khi đóng |
| `data-animation` | root | `"false"` tắt animation chiều cao; `""` / `"true"` bật (mặc định bật) |
| `data-animation-duration` | root | Thời lượng ms (mặc định `200`) |
| `data-animation-delay` | root | Độ trễ ms (mặc định `0`) |
| `data-animation-easing` | root | `ease-in-out`, `linear`, hoặc bất kỳ CSS timing function nào (mặc định `ease-in-out`) |

Attribute trên root sau khi init: `data-slot="collapsible"`, `data-state="open" \| "closed"`, `data-disabled` khi bị vô hiệu hóa. Trigger nhận `aria-expanded` / `aria-controls`.

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

| Attribute | Trên | Mô tả |
| --- | --- | --- |
| `data-accordion` | root | Đánh dấu root của Accordion |
| `data-accordion-type` | root | `single` (mặc định) \| `multiple` |
| `data-collapsible` | root | Cho phép đóng item đang mở ở chế độ single |
| `data-default-value` | root | Giá trị ban đầu; phân tách bằng khoảng trắng/dấu phẩy với `multiple` |
| `data-disabled` | root hoặc item | Vô hiệu hóa root hoặc một item |
| `data-accordion-item` + `data-value` | item | ID ổn định của item |
| `data-accordion-trigger` | `<button>` | Trigger của item (nên đặt trong `h2`–`h6`) |
| `data-accordion-content` | panel | Vùng content của item |
| Animation attrs | root | Giống Collapsible |

Bàn phím (trigger đang bật): `ArrowDown` / `ArrowUp` / `Home` / `End`. Các accordion lồng nhau độc lập.

### Animation

Animation chiều cao dùng CSS `grid-template-rows` (`minmax(0, 0fr)` ↔ `minmax(0, 1fr)`), bật mặc định (Overlay: tắt; duration mặc định 200ms so với 160ms; không có `type` / `direction`). `prefers-reduced-motion: reduce` tắt chuyển động. Content vẫn được mount trong lúc transition đóng, sau đó được gỡ ra trừ khi đặt `data-force-mount`.

CSS variable trên content viewport:

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

Gọi `createDisclosure()` hai lần trên cùng root không đăng ký listener trùng. Dùng `refresh()` hoặc `destroy()` + `createDisclosure()` khi markup thay đổi.

## Styling hooks

Headless — không có theme hay icon. Style bằng CSS của bạn và:

- `data-slot` — `collapsible`, `collapsible-trigger`, `collapsible-content`, `accordion`, `accordion-item`, `accordion-heading`, `accordion-trigger`, `accordion-content`
- `data-state` — `open` \| `closed`
- `data-disabled`

Đặt chrome trên class/style của phần tử content (áp dụng lên `[data-collapsible-content-wrapper]`).

## Agent Skill

Hướng dẫn thực dụng cho agent: [skills/disclosure-vanilla.md](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vanilla.md)

## License

MIT © Zealakit
