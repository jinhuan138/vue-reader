import { resolve } from 'path'
import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
// import { baseBuildConfig, defaultPlugins } from '../vite.base.config'

export const viteVue2Config = defineConfig({
  plugins: [vue2()],
  publicDir: '../../public',
  server: {
    port: 2700,
  },
  resolve: {
    alias: {
      vue: resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(
        __dirname,
        '../../node_modules/vue-demi/lib/v2.7/index.mjs'
      ),
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})

export default viteVue2Config
