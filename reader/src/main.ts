import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import piniaPersist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import './style.css'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)

app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
