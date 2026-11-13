# @zealakit/disclosure-vanilla

[English](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Collapsible và Accordion headless cho vanilla JavaScript / HTML tĩnh. Cung cấp state, accessibility và animation chiều cao — không cần React, Vue hay Svelte. Bạn tự style.

Viết HTML ngữ nghĩa với `data-*`, rồi gọi `createDisclosure()` một lần. Đặt padding/border/background trên class của phần tử content (được chuyển sang `[data-collapsible-content-wrapper]` lúc init) để animation đóng gọn sạch.

> **Note**
>
> Disclosure không thay thế UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi chỉ cần một primitive và không muốn kéo cả design system.

## Cài đặt

### npm / bundler

```bash
npm i @zealakit/disclosure-vanilla
# hoặc: pnpm add / yarn add / bun add
```

Không có peer dependency. Dùng với bundler (Vite, esbuild, …) hoặc import map trỏ tới bản ESM.

### CDN (HTML tĩnh)

Luôn **pin version** trên production — không dùng URL `latest` không version.

Global IIFE: **`ZealakitDisclosure`**.

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

Chi tiết file `dist/*`: xem [README.md](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md#cdn-static-html).

## Bắt đầu nhanh

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

## API công khai

| Export | Mô tả |
| --- | --- |
| `createDisclosure(root?)` | Khởi tạo mọi `[data-disclosure]` / `[data-accordion]` trong `document` hoặc một root |
| `DisclosureController.destroy()` | Gỡ listener và khôi phục content |
| `DisclosureController.refresh()` | Destroy + quét lại (markup động) |

Bảng attribute, Accordion, animation và styling: xem [README.md](https://github.com/zealakit/disclosure/blob/main/packages/vanilla/README.md) (English) — cùng contract với các package framework.

## Agent skill

[skills/disclosure-vanilla.md](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vanilla.md)

## License

MIT © Zealakit
