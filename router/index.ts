import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Reader from "comps/Reader.vue"
import Library from "comps/Library.vue"

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Reader },
    { path: '/library', component: Library }
]

const router = createRouter({
    history: createWebHistory('/reader'),
    routes, 
})

export default router