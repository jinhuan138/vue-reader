import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://cn.vitejs.dev/
export default defineConfig({
  base: "/reader/",
  plugins: [vue(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),],
  publicDir: 'public',
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: 'comps', replacement: resolve(__dirname, 'src/components') }
    ]
  },
  server: {
    port: 8025,
    open: true
  }
})
