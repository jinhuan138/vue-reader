//reference
// 
//https://www.npmjs.com/package/react-reader
//https://github.com/janglee123/eplee
//https://github.com/weijan-vscode/vscode-epub-viewer.git
//https://github.com/m8524769/espacio.git
//http://futurepress.github.io/epub.js/examples/
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from 'router'
import './style.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.mount('#app')
