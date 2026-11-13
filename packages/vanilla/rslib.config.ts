import { defineConfig } from "@rslib/core";

const GLOBAL_NAME = "ZealakitDisclosure";

const webTarget = {
  target: "web" as const,
  // Keep browser bundles free of Node shims / builtins.
  overrideBrowserslist: ["defaults"],
};

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: true,
      output: {
        ...webTarget,
        filename: {
          js: "index.js",
        },
      },
    },
    {
      // Browser <script> build (IIFE) exposing window.ZealakitDisclosure
      format: "iife",
      syntax: "es2022",
      bundle: true,
      autoExtension: false,
      output: {
        ...webTarget,
        minify: false,
        filename: {
          js: "index.global.js",
        },
      },
      tools: {
        rspack: {
          output: {
            library: {
              name: GLOBAL_NAME,
              type: "var",
            },
            iife: true,
          },
        },
      },
    },
    {
      format: "iife",
      syntax: "es2022",
      bundle: true,
      autoExtension: false,
      output: {
        ...webTarget,
        minify: true,
        filename: {
          js: "index.global.min.js",
        },
      },
      tools: {
        rspack: {
          output: {
            library: {
              name: GLOBAL_NAME,
              type: "var",
            },
            iife: true,
          },
        },
      },
    },
  ],
  source: {
    entry: {
      index: "./src/index.ts",
    },
    tsconfigPath: "./tsconfig.build.json",
  },
  output: {
    target: "web",
  },
});
