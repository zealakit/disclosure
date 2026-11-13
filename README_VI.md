# Disclosure

[English](https://github.com/zealakit/disclosure/blob/main/README.md) | [Tiếng Việt](https://github.com/zealakit/disclosure/blob/main/README_VI.md) | [中文](https://github.com/zealakit/disclosure/blob/main/README_CN.md)

![Disclosure cover](https://github.com/zealakit/disclosure/blob/main/assets/images/disclosure-cover.jpg?raw=true)

Bộ primitive disclosure headless cho các UI framework hiện đại.

**Disclosure** hiện có hai primitive độc lập:

- **Collapsible** — một panel mở/đóng
- **Accordion** — nhóm panel với chế độ chọn một hoặc nhiều

Chỉ cung cấp hành vi và accessibility — không màu, icon hay layout. Animation chiều cao bật sẵn theo mặc định. Tự style bằng CSS qua `data-slot` và `data-state`.

> **Note**
>
> Disclosure không thay thế một UI library đầy đủ. Dùng khi Accordion/Collapsible trong kit khó custom — hoặc khi bạn chỉ cần một primitive đó và không muốn kéo cả design system lớn.

## Packages

| Package | Framework | Tài liệu |
| --- | --- | --- |
| `@zealakit/disclosure-react` | React 18+ | [packages/react/README_VI.md](https://github.com/zealakit/disclosure/blob/main/packages/react/README_VI.md) |
| `@zealakit/disclosure-vue` | Vue 3.5+ | [packages/vue/README_VI.md](https://github.com/zealakit/disclosure/blob/main/packages/vue/README_VI.md) |
| `@zealakit/disclosure-svelte` | Svelte 5 | [packages/svelte/README_VI.md](https://github.com/zealakit/disclosure/blob/main/packages/svelte/README_VI.md) |

Mỗi package cài độc lập. Không có shared runtime package.

API, props và hướng dẫn dùng nằm trong tài liệu package ở trên.

## Cài đặt

Dùng package manager bạn thích (`npm`, `pnpm`, `yarn`, `bun`, …):

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

UI local để theo dõi dependency ở root + `packages/*` (không gồm `examples/`):

```bash
pnpm monitor
```

Mở http://127.0.0.1:4177 — xem [monitor/README.md](https://github.com/zealakit/disclosure/blob/main/monitor/README.md).

## AI Agent Skills

Hướng dẫn theo framework dành cho AI coding agent:

- [Disclosure React Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-react.md)
- [Disclosure Vue Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-vue.md)
- [Disclosure Svelte Skill](https://github.com/zealakit/disclosure/blob/main/skills/disclosure-svelte.md)

## License

MIT © Zealakit
