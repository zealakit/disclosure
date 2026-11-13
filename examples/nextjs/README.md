# Next.js App Router example

Demonstrates `@zealakit/disclosure-react` with:

- App Router
- React Server Components
- Client Components (`"use client"` owned by the app)
- SSR + hydration

## Run

From the monorepo root:

```bash
pnpm install
pnpm build:react
pnpm --filter @zealakit/disclosure-nextjs-example dev
```

Production:

```bash
pnpm --filter @zealakit/disclosure-nextjs-example build
pnpm --filter @zealakit/disclosure-nextjs-example start
```

## Client boundary

`layout.tsx` and `page.tsx` are Server Components.

Only the interactive demos under `src/app/components/` use `"use client"`. Import those Client Components from Server Components as usual.

`@zealakit/disclosure-react` does not declare `"use client"`. Your application decides where the client boundary starts.
