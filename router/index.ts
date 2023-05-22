//https://router.vuejs.org/zh/
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/reader' },
    { name: "reader", path: '/reader', component: () => import('comps/reader/index.vue') },
    { name: "test", path: '/test', component: () => import('comps/Test.vue') },
    { name: "demo", path: '/demo', component: () => import('comps/Demo.vue') },
]

const router = createRouter({
    history: createWebHistory('/vue-reader'),
    routes,
})

export default router