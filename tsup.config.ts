import { defineConfig } from "tsup"
import path from "path"

export default defineConfig({
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
    }
  },
})
