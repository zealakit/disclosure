import { spawnSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "artifacts");
const packages = [
  "@zealakit/disclosure-vanilla",
  "@zealakit/disclosure-react",
  "@zealakit/disclosure-vue",
  "@zealakit/disclosure-svelte",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const name of packages) {
  const result = spawnSync(
    "pnpm",
    ["--filter", name, "pack", "--pack-destination", output],
    { cwd: root, stdio: "inherit" },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
