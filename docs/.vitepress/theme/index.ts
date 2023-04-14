import DefaultTheme from 'vitepress/theme'
import { EnhanceAppContext } from "vitepress"
import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { VueReader } from "vue-reader";
import router from "../../router/index"

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp(ctx)
    const { app, siteData } = ctx
    app.component('VueReader', VueReader)
  }
}