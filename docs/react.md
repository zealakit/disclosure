# @zealakit/collapsible-react

Headless Collapsible and Accordion for React. Provides state, composition, accessibility, and a built-in height animation. You own visual styling.

## Install

```bash
pnpm add @zealakit/collapsible-react
```

Peer dependencies: `react`, `react-dom` (≥ 18).

## Collapsible

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-react";

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open-state change callback |
| `disabled` | `boolean` | `false` | Disables interaction |
| `animated` | `boolean` | `true` | Built-in height animation |

`CollapsibleContent` supports `forceMount` to keep content mounted while closed.

### Controlled

```tsx
const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen}>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>Content</CollapsibleContent>
</Collapsible>
```

### Disable animation

```tsx
<Collapsible animated={false}>...</Collapsible>
```

### Animation CSS variables

```css
[data-slot="collapsible"] {
  --collapsible-animation-duration: 240ms;
  --collapsible-animation-easing: cubic-bezier(0.16, 1, 0.3, 1);
}
```

`prefers-reduced-motion: reduce` forces a zero-duration transition.

## Accordion

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@zealakit/collapsible-react";

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

### Single mode

- Only one item open at a time
- `collapsible` (default `false`) allows closing the open item
- Controlled via `value` / `defaultValue` / `onValueChange` (`string | null`)

### Multiple mode

```tsx
<Accordion type="multiple" defaultValue={["general"]}>
  ...
</Accordion>
```

- Multiple items can be open
- `collapsible` does not apply
- Values are `string[]`

### Shared Accordion props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `animated` | `boolean` | `true` | Height animation for item panels |
| `disabled` | `boolean` | `false` | Disables the whole accordion |

Item-level `disabled` is also supported. Keyboard: Arrow Up/Down, Home, End.

## Next.js App Router

The package does not declare `"use client"`. Mark interactive leaves in your app. See [`examples/nextjs`](../examples/nextjs).
