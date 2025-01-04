import DefaultTheme from 'vitepress/theme'
import { EnhanceAppContext } from "vitepress"
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'
import reader from '../../../reader/src/components/index.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const pinia = createPinia()
import pkg from '../../../package.json'
console.log(
  `%c ${pkg.name} %c v`.concat(pkg.version, ' '),
  'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff',
  'background: skyblue; padding: 1px; border-radius: 0 3px 3px 0; color: #fff',
)

if (!import.meta.env.SSR) {
  import('pinia-plugin-persistedstate').then((piniaPluginPersistedstate) => {
    pinia.use(piniaPluginPersistedstate.default)
  })
}

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    const { app, siteData } = ctx
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    app.use(ElementPlus)
    app.use(pinia)
    app.component('Reader', reader)
  }
}