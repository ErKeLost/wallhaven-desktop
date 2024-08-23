import { defineConfig } from 'vite'
import { VarletImportResolver } from '@varlet/import-resolver'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import icon from '@varlet/unplugin-icon-builder/vite'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import vueRouter from 'unplugin-vue-router/vite'
import unoCSS from 'unocss/vite'

export default defineConfig(() => ({
  base: './',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          img: ['src'],
          video: ['src'],
          audio: ['src'],
          'var-image': ['src'],
          'var-avatar': ['src'],
          'var-card': ['src'],
          'var-app-bar': ['image'],
        },
      },
    }),

    components({
      resolvers: [VarletImportResolver()],
    }),

    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [VarletImportResolver({ autoImport: true })],
      eslintrc: { enabled: true },
    }),

    icon({ dir: 'src/assets/icons', onDemand: true }),

    vueRouter(),

    unoCSS(),
  ],

  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}))
