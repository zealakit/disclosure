import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: false,
    },
  ],
  source: {
    entry: {
      index: ["./src/**/*.{ts,tsx}", "!./src/**/*.test.*"],
    },
    tsconfigPath: "./tsconfig.build.json",
  },
  output: {
    target: "web",
    externals: ["react", "react-dom", "react/jsx-runtime"],
  },
  plugins: [pluginReact()],
});
