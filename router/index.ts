import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Reader from "comps/Reader.vue"
import Library from "comps/Library.vue"
import Test from "comps/Test.vue"

const routes: Array<RouteRecordRaw> = [
    { path: '/', component: Reader },
    { path: '/library', component: Library },
    { path: '/test', component: Test },
]

const router = createRouter({
    history: createWebHistory('/reader'),
    routes,
})

export default router