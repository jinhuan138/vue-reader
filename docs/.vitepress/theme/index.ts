import DefaultTheme from 'vitepress/theme'; //引入默认主题
import { VueReader } from "vue-reader";
import router from "../../router/index"

export default {
  ...DefaultTheme,
  enhanceApp({ app, siteData }) {
    app.use(router)
    app.component('VueReader', VueReader)
  }
}