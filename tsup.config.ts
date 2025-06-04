import { defineConfig } from "tsup"
import { pluginReplace } from "@espcom/esbuild-plugin-replace"

export default defineConfig([
  {
    entry: ["src/index.ts"],
    outDir: "dist/nodejs",
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/index.ts"],
    outDir: "dist/browser",
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildPlugins: [
      // @ts-ignore
      pluginReplace([
        {
          filter: /\.ts$/,
          replace: "cardano-wasm-libs/nodejs",
          replacer: () => "cardano-wasm-libs/browser",
        },
      ]),
    ],
  },
  {
    entry: ["src/index.ts"],
    outDir: "dist/web",
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildPlugins: [
      // @ts-ignore
      pluginReplace([
        {
          filter: /\.ts$/,
          replace: "cardano-wasm-libs/nodejs",
          replacer: () => "cardano-wasm-libs/web",
        },
      ]),
    ],
  },
])
