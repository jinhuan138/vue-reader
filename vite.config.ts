import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

// https://cn.vitejs.dev/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    tsconfigPaths({
      root: __dirname,
    }),
    visualizer() as PluginOption,
  ],
  publicDir: 'public',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: 'comps', replacement: resolve(__dirname, 'src/components') },
    ],
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  server: {
    port: 8025,
  },
})
