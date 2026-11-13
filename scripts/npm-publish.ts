/**
 * Manual npm publish for Disclosure framework packages.
 *
 *   pnpm npm:publish:check
 *   pnpm npm:publish:react | npm:publish:vue | npm:publish:svelte | npm:publish:vanilla
 *   pnpm npm:publish:all
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

type FrameworkId = "react" | "vue" | "svelte" | "vanilla";
type Command = "check" | FrameworkId | "all";

type PackageJson = {
  name?: string;
  version?: string;
  private?: boolean;
  files?: string[];
  exports?: unknown;
  publishConfig?: {
    access?: string;
  };
  scripts?: Record<string, string>;
};

type PackageConfig = {
  id: FrameworkId;
  label: string;
  dirName: string;
  expectedName: string;
  packageDir: string;
  packageJsonPath: string;
  manifest: PackageJson;
};

const FRAMEWORKS: Array<{
  id: FrameworkId;
  label: string;
  dirName: string;
  expectedName: string;
}> = [
  {
    id: "react",
    label: "React",
    dirName: "react",
    expectedName: "@zealakit/disclosure-react",
  },
  {
    id: "vue",
    label: "Vue",
    dirName: "vue",
    expectedName: "@zealakit/disclosure-vue",
  },
  {
    id: "svelte",
    label: "Svelte",
    dirName: "svelte",
    expectedName: "@zealakit/disclosure-svelte",
  },
  {
    id: "vanilla",
    label: "Vanilla",
    dirName: "vanilla",
    expectedName: "@zealakit/disclosure-vanilla",
  },
];

const VERSION_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function printHelp(): void {
  console.log(`Usage:
  pnpm npm:publish:check
  pnpm npm:publish:react
  pnpm npm:publish:vue
  pnpm npm:publish:svelte
  pnpm npm:publish:vanilla
  pnpm npm:publish:all

Or:
  node --strip-types scripts/npm-publish.ts <check|react|vue|svelte|vanilla|all>

check    Run pre-publish validation for all packages (no publish)
react    Validate, build, and publish @zealakit/disclosure-react
vue      Validate, build, and publish @zealakit/disclosure-vue
svelte   Validate, build, and publish @zealakit/disclosure-svelte
vanilla  Validate, build, and publish @zealakit/disclosure-vanilla
all      Publish react → vue → svelte → vanilla sequentially (stops on first failure)
`);
}

function fail(message: string): never {
  throw new Error(message);
}

function parseCommand(argv: string[]): Command {
  const command = argv[0];
  if (
    command === "check" ||
    command === "react" ||
    command === "vue" ||
    command === "svelte" ||
    command === "vanilla" ||
    command === "all"
  ) {
    return command;
  }
  printHelp();
  fail(
    command
      ? `Unknown command "${command}".`
      : "Missing command. Pass check, react, vue, svelte, vanilla, or all.",
  );
}

function readJson(filePath: string): PackageJson {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as PackageJson;
  } catch (error) {
    fail(
      `Failed to read ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function getPackageConfig(id: FrameworkId): PackageConfig {
  const meta = FRAMEWORKS.find((item) => item.id === id);
  if (!meta) {
    fail(`Unknown package id "${id}".`);
  }

  const packageDir = path.join(PROJECT_ROOT, "packages", meta.dirName);
  const packageJsonPath = path.join(packageDir, "package.json");

  if (!fs.existsSync(packageDir)) {
    fail(`Package directory not found: ${packageDir}`);
  }
  if (!fs.existsSync(packageJsonPath)) {
    fail(`package.json not found: ${packageJsonPath}`);
  }

  return {
    ...meta,
    packageDir,
    packageJsonPath,
    manifest: readJson(packageJsonPath),
  };
}

function validatePackage(pkg: PackageConfig): void {
  const { manifest, expectedName, label, packageJsonPath } = pkg;

  if (manifest.private === true) {
    fail(`${label} package is marked private and cannot be published.`);
  }

  if (manifest.name !== expectedName) {
    fail(
      `${label} package name mismatch in ${packageJsonPath}: expected "${expectedName}", found "${manifest.name ?? "(missing)"}".`,
    );
  }

  if (!manifest.version || !VERSION_RE.test(manifest.version)) {
    fail(
      `${label} package has an invalid version: "${manifest.version ?? "(missing)"}".`,
    );
  }

  if (!manifest.files || manifest.files.length === 0) {
    fail(`${label} package is missing a non-empty "files" field.`);
  }

  if (!manifest.exports) {
    fail(`${label} package is missing "exports".`);
  }

  if (manifest.publishConfig?.access !== "public") {
    fail(
      `${label} package must set publishConfig.access to "public" (found "${manifest.publishConfig?.access ?? "(missing)"}").`,
    );
  }

  const scripts = manifest.scripts ?? {};
  for (const scriptName of ["build", "test", "typecheck"] as const) {
    if (!scripts[scriptName]) {
      fail(`${label} package is missing script "${scriptName}".`);
    }
  }
}

function runCaptured(
  command: string,
  args: string[],
  cwd: string,
): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    fail(`Failed to run ${command} ${args.join(" ")}: ${result.error.message}`);
  }

  return {
    status: result.status,
    stdout: (result.stdout ?? "").trim(),
    stderr: (result.stderr ?? "").trim(),
  };
}

function runInherited(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    fail(`Failed to run ${command} ${args.join(" ")}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`Command failed (${result.status}): ${command} ${args.join(" ")}`);
  }
}

function checkNpmAuthentication(): string {
  const result = runCaptured("npm", ["whoami"], PROJECT_ROOT);
  if (result.status !== 0 || !result.stdout) {
    const detail = result.stderr || result.stdout || "unknown error";
    fail(
      `npm is not authenticated. Run \`npm login\` first.\nDetails: ${detail}`,
    );
  }
  return result.stdout;
}

function isNpmNotFound(stderr: string, stdout: string): boolean {
  const text = `${stderr}\n${stdout}`;
  return (
    /\bE404\b/.test(text) ||
    /404 Not Found/i.test(text) ||
    /code E404/i.test(text) ||
    /version not found/i.test(text)
  );
}

function checkVersionAvailability(pkg: PackageConfig): void {
  const name = pkg.manifest.name as string;
  const version = pkg.manifest.version as string;
  const result = runCaptured(
    "npm",
    ["view", `${name}@${version}`, "version"],
    PROJECT_ROOT,
  );

  if (result.status === 0) {
    fail(
      `${name}@${version} already exists on npm. Bump the version in ${pkg.packageJsonPath} before publishing.`,
    );
  }

  if (isNpmNotFound(result.stderr, result.stdout)) {
    return;
  }

  const detail = result.stderr || result.stdout || `exit ${result.status}`;
  fail(
    `Could not verify whether ${name}@${version} exists on npm.\nDetails: ${detail}`,
  );
}

function assertBuiltEntryPoints(pkg: PackageConfig): void {
  const required = ["dist/index.js", "dist/index.d.ts"];
  if (pkg.id === "vanilla") {
    required.push("dist/index.global.js", "dist/index.global.min.js");
  }
  for (const relativePath of required) {
    const absolutePath = path.join(pkg.packageDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      fail(`${pkg.label} build is missing required entry "${relativePath}".`);
    }
  }
}

function buildPackage(pkg: PackageConfig): void {
  runInherited("pnpm", ["run", "build"], pkg.packageDir);
  assertBuiltEntryPoints(pkg);
}

function runPackageChecks(pkg: PackageConfig): void {
  runInherited("pnpm", ["run", "typecheck"], pkg.packageDir);
  runInherited("pnpm", ["run", "test"], pkg.packageDir);
}

function previewPackage(pkg: PackageConfig): void {
  runInherited("npm", ["pack", "--dry-run"], pkg.packageDir);
}

function publishPackage(pkg: PackageConfig): void {
  runInherited("npm", ["publish", "--access", "public"], pkg.packageDir);
}

function logStep(current: number, total: number, message: string): void {
  console.log(`\n[${current}/${total}] ${message}`);
}

function preparePackage(
  pkg: PackageConfig,
  options: { publish: boolean },
): void {
  const total = options.publish ? 4 : 3;
  const name = pkg.manifest.name as string;
  const version = pkg.manifest.version as string;

  console.log(`\n=== ${pkg.label}: ${name}@${version} ===`);

  logStep(1, total, `Validating ${pkg.label} package`);
  validatePackage(pkg);
  checkVersionAvailability(pkg);

  logStep(2, total, `Building ${pkg.label} package`);
  buildPackage(pkg);
  runPackageChecks(pkg);

  logStep(3, total, `Checking ${pkg.label} package contents`);
  previewPackage(pkg);

  if (!options.publish) {
    console.log(`\n${pkg.label} package checks passed (not published).`);
    return;
  }

  logStep(4, total, `Publishing ${pkg.label} package`);
  publishPackage(pkg);
  console.log(`\n${pkg.label} package published successfully.`);
}

function main(): void {
  const command = parseCommand(process.argv.slice(2));
  process.chdir(PROJECT_ROOT);

  const npmUser = checkNpmAuthentication();
  console.log(`npm user: ${npmUser}`);
  console.log(`repository: ${PROJECT_ROOT}`);

  if (command === "check") {
    for (const framework of FRAMEWORKS) {
      preparePackage(getPackageConfig(framework.id), { publish: false });
    }
    console.log("\nAll package checks passed. Nothing was published.");
    return;
  }

  if (command === "all") {
    const published: string[] = [];
    for (const framework of FRAMEWORKS) {
      const pkg = getPackageConfig(framework.id);
      try {
        preparePackage(pkg, { publish: true });
        published.push(`${pkg.manifest.name}@${pkg.manifest.version}`);
      } catch (error) {
        console.error("\n=== Publish summary ===");
        console.error(
          `Published: ${
            published.length > 0 ? published.join(", ") : "(none)"
          }`,
        );
        console.error(`Failed: ${pkg.manifest.name}@${pkg.manifest.version}`);
        console.error(
          "Note: npm publishing is not atomic. Successful packages above remain published.",
        );
        throw error;
      }
    }

    console.log("\n=== Publish summary ===");
    console.log(`Published: ${published.join(", ")}`);
    console.log("All packages published successfully.");
    return;
  }

  preparePackage(getPackageConfig(command), { publish: true });
}

try {
  main();
} catch (error) {
  console.error(
    `\nError: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}
