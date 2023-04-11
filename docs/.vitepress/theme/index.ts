import DefaultTheme from 'vitepress/theme'; //引入默认主题
import { RouteRecordRaw } from 'vue-router'
import demo from 'vitepress-demoblock/demo.vue'
// import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { VueReader } from "vue-reader";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx)
    const { app, siteData } = ctx
    app.component('VueReader', VueReader)
  }
}