import Vue, { version } from 'vue'
import App from './App.vue'

console.warn('Vue version: ', version)
Vue.config.productionTip = false

new Vue({ render: h => h(App) }).$mount('#app')
