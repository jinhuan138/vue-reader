import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    copyPublicDir: false,
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    outDir: 'lib',
    lib: {
      entry: 'src/modules/index.ts',
      name: 'vue-reader',
      fileName: (format) => `vue-reader.${format}.js`,
    },
    rollupOptions: {
      external:  ['vue', 'vue-demi', 'epubjs']
    },
  },
})
