import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'unplugin-dts/vite'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import { name } from './package.json'
// https://cn.vitejs.dev/
const outDir = 'lib'
export default defineConfig({
  base: '/',
  publicDir: 'public',
    plugins: [
    vue(),
    tsconfigPaths({
      root: __dirname,
    }),
    libInjectCss(),
    // dts({
    //   bundleTypes: true,
    //   outDir,
    //   include: [
    //     'src/packages',
    //     'types/*.ts',
    //   ],
    //   compilerOptions: {
    //     sourceMap: false,
    //   },
    // }),
  ],
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
    minify: false,
    outDir,
    lib: {
      entry: resolve(__dirname, 'src/packages/index.ts'),
      name,
      fileName: (format) => `${name}.${format}.js`,
      formats: ['es', 'umd', 'cjs'],
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
