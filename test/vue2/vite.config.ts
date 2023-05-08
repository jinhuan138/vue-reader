import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'
import ScriptSetup from 'unplugin-vue2-script-setup/vite'

export const viteVue2Config = defineConfig({
  plugins: [vue2(), ScriptSetup({}),],
  server: {
    port: 2000,
  },
  publicDir: '../../public',
  resolve: {
    alias: {
      'vue': resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      'vue-demi': resolve(__dirname, './node_modules/vue-demi/lib/v2/index.mjs'),
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi']
  }
})

export default viteVue2Config
