import DefaultTheme from 'vitepress/theme'; //引入默认主题
import demo from 'vitepress-demoblock/demo.vue'
// import 'vitepress-theme-demoblock/dist/theme/styles/index.css'
import { VueReader } from "vue-reader";

export default {
    ...DefaultTheme,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx)
        ctx.app.component('VueReader',VueReader)
      }
}