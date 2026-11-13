# @zealakit/collapsible-react

Headless Collapsible primitives for React.

See [docs/react.md](../../docs/react.md) for the full API.

```bash
pnpm add @zealakit/collapsible-react
```

```tsx
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@zealakit/collapsible-react";

export function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
}
```

For Next.js App Router, put `"use client"` on your interactive components — this package does not declare the client boundary. See [`examples/nextjs`](../../examples/nextjs).
