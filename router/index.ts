//https://router.vuejs.org/zh/
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/library' },
    { name: "library", path: '/library', component: () => import('comps/Library.vue') },
    { name: "reader", path: '/reader/:id?/:name?', component: () => import('comps/Reader.vue'), props: true },
    { name: "test", path: '/test', component: () => import('comps/Test.vue') },
    { name: "demo", path: '/demo', component: () => import('comps/Demo.vue') },
]

const router = createRouter({
    history: createWebHistory('/vue-reader'),
    routes,
})

export default router