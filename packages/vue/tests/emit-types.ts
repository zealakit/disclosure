import { h } from "vue";
import { Accordion, Collapsible } from "../dist/index.js";

// Type-level checks: `tsc -p tests/tsconfig.json` fails if emits are not typed.
h(Collapsible, { "onUpdate:open": (open: boolean) => void open });
h(Collapsible, {
  // @ts-expect-error the handler receives a boolean
  "onUpdate:open": (open: string) => void open,
});
h(Accordion, {
  type: "single",
  "onUpdate:value": (value: string | null | string[]) => void value,
});
