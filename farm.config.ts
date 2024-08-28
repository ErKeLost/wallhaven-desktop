import { defineConfig } from '@farmfe/core';
import path from 'node:path'
import react from '@farmfe/plugin-react'
import postcss from "@farmfe/js-plugin-postcss"

export default defineConfig({
  plugins: [react(), postcss()],
  compilation: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      }
    },
    output: {
      targetEnv: 'browser-esnext'
    }
  },
  server: {
    port: 1420
  }
});
