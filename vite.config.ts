import { defineConfig, type PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { name } from './package.json'
// https://cn.vitejs.dev/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    tsconfigPaths({
      root: __dirname,
    }),
  ],
  publicDir: 'public',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: 'comps', replacement: resolve(__dirname, 'src/components') },
    ],
  },
  server: {
    port: 8025,
  },
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    minify: 'terser',
    outDir: 'lib',
    lib: {
      entry: 'src/packages/index.ts',
      name,
      fileName: (format) => `${name}.${format}.js`,
      formats:['es','umd','cjs']
    },
    rollupOptions: {
      external: ['vue', 'epubjs'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
