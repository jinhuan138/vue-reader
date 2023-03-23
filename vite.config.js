import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.cn/vite3-cn/
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
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }]
  },
  server: {
    port: 8025
  }
})
