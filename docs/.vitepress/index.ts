import DefaultTheme from 'vitepress/theme'; //引入默认主题
import demo from 'vitepress-demoblock/demo.vue'
export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('demo', demo)
    }
}