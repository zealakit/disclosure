import { pluginVue } from "@rsbuild/plugin-vue";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: true,
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
    externals: ["vue"],
  },
  plugins: [pluginVue()],
});
