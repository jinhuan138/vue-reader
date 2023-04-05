//reference
//https://github.com/troyeguo/koodo-reader
//https://www.npmjs.com/package/react-reader
//https://github.com/janglee123/eplee
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import router from 'router'
import './style.css'
import 'element-plus/dist/index.css'
import App from './App.vue'
const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')
