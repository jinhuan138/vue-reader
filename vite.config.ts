import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://cn.vitejs.dev/
export default defineConfig({
  base: "/reader/",
  plugins: [vue(),
  tsconfigPaths({
    root: __dirname,
  }),
  AutoImport({
    resolvers: [ElementPlusResolver()],
    dts: 'types/auto-import.d.ts',
  }),
  Components({
    resolvers: [ElementPlusResolver()],
    dts: 'types/components.d.ts',
  }),],
  publicDir: 'public',
  resolve: {
    extensions: ['.ts', '.js'],
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
