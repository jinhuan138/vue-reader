import DefaultTheme from 'vitepress/theme'
import { EnhanceAppContext } from "vitepress"
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import Demo from 'vitepress-theme-demoblock/dist/client/components/Demo.vue'
import DemoBlock from 'vitepress-theme-demoblock/dist/client/components/DemoBlock.vue'
import { VueReader } from "@/modules/index"
// import { VueReader } from "vue-reader"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import reader from 'comps/reader/index.vue'
// import router from "../../router/index"

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    const { app, siteData } = ctx
    app.component('VueReader', VueReader)
    app.component('Demo', Demo)
    app.component('DemoBlock', DemoBlock)
    app.use(ElementPlus)
    // app.use(router)
    app.component('Reader', reader)
  }
}